require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const supabase = require("./config/supabase");
const authClient = require("./config/supabaseAuth");
const deleteFromCloudinary = require("./utils/cloudinaryDelete");


const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const upload = require("./middleware/uploadMiddleware");
const {
    addProduct,
    updateProduct
} = require("./controllers/productController");

const {
    getMessages,
    markAsRead,
    deleteMessage
} = require("./controllers/contactController");

const formatProduct = (row) => ({
    ...row,
    _id: row.id,
    sliderOrder: row.slider_order,
    createdAt: row.created_at
});

const app = express();
const PORT = process.env.PORT || 5001;

// ==========================================
// DATABASE
// ==========================================

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// EJS
// ==========================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==========================================
// PUBLIC STOREFRONT
// ==========================================
app.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(8);

        if (error) throw error;

        const products = (data || []).map(formatProduct);
        res.render("index", { products });
    } catch (error) {
        console.error(error);
        res.render("index", { products: [] });
    }
});

// ==========================================
// LOGIN & LOGOUT
// ==========================================
// ==========================================

// CUSTOMER REGISTRATION - SUPABASE AUTH
app.post("/customer/register", async (req, res) => {
    try {
        const { username, mobile, age, gender, email, password } = req.body;

        if (!username?.trim() || !mobile?.trim() || !age || !gender || !email?.trim() || !password) {
            return res.status(400).send("Please fill all fields");
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: created, error: createError } =
            await supabase.auth.admin.createUser({
                email: normalizedEmail,
                password,
                email_confirm: true,
                user_metadata: { username: username.trim() }
            });

        if (createError) {
            if (createError.message.toLowerCase().includes("already")) {
                return res.status(409).send("Email already registered");
            }
            throw createError;
        }

        const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
                id: created.user.id,
                username: username.trim(),
                mobile: mobile.trim(),
                age: Number(age),
                gender,
                role: "customer"
            });

        if (profileError) throw profileError;

        const { data: loginData, error: loginError } =
            await authClient.auth.signInWithPassword({
                email: normalizedEmail,
                password
            });

        if (loginError) throw loginError;

        res.cookie("customerToken", loginData.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: loginData.session.expires_in * 1000
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Customer Registration Error:", error.message);
        return res.status(500).send("Unable to register customer");
    }
});

// ADMIN LOGIN - SUPABASE AUTH
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await authClient.auth.signInWithPassword({
            email: email?.trim().toLowerCase(),
            password
        });

        if (error || !data.user) {
            return res.status(401).send("Invalid Email or Password");
        }

        const { data: profileRows, error: profileError } = await supabase
            .from("profiles")
            .select("id, username, role")
            .eq("id", data.user.id);

        console.log("LOGIN PROFILE ROWS:", profileRows);
        console.log("LOGIN PROFILE ERROR:", profileError);

        const profile = profileRows?.[0] || null;

        if (profileError || profile?.role !== "admin") {
            return res.status(403).send("Admin access only");
        }

        res.cookie("token", data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: data.session.expires_in * 1000
        });

        return res.redirect("/admin");
    } catch (error) {
        console.error("Admin Login Error:", error.message);
        return res.status(500).send("Unable to login");
    }
});

// CUSTOMER LOGIN - SUPABASE AUTH
app.post("/customer/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const { data, error } = await authClient.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
        });

        if (error || !data.user) {
            return res.status(401).send("Invalid Email or Password");
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (profileError || profile?.role !== "customer") {
            return res.status(403).send("Customer account not found");
        }

        res.cookie("customerToken", data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: data.session.expires_in * 1000
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Customer Login Error:", error.message);
        return res.status(500).send("Unable to login");
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

app.get("/customer/logout", (req, res) => {
    res.clearCookie("customerToken");
    res.redirect("/");
});

// ADMIN DASHBOARD (UPDATED SINGLE ROUTE)
// ==========================================
app.get(
    "/admin",
    authMiddleware,
    async (req, res) => {
        try {
            const [
                { data: productRows, error: productError },
                { count: totalMessagesCount, error: contactsError },
                { count: newMessagesCount, error: newMessagesError }
            ] = await Promise.all([
                supabase.from("products").select("category"),
                supabase.from("contacts").select("id", { count: "exact", head: true }),
                supabase.from("contacts").select("id", { count: "exact", head: true }).eq("status", "new")
            ]);

            if (productError) throw productError;
            if (contactsError) throw contactsError;
            if (newMessagesError) throw newMessagesError;

            const totalProducts = productRows.length;
            const totalMessages = totalMessagesCount || 0;
            const newMessages = newMessagesCount || 0;
            const menProducts = productRows.filter(p => p.category === "Men").length;
            const kidsProducts = productRows.filter(p => p.category === "Kids").length;

            res.render("admin", {
                totalProducts,
                totalMessages,
                newMessages,
                menProducts,
                kidsProducts
            });
        } catch (error) {
            console.error("Dashboard Error:", error);
            res.status(500).send("Unable to load dashboard");
        }
    }
);

app.get(
    "/admin/dashboard",
    authMiddleware,
    (req, res) => {
        res.redirect("/admin");
    }
);

// ==========================================
// ADD PRODUCT
// ==========================================
app.get(
    "/admin/add-product",
    authMiddleware,
    (req, res) => {
        res.render("add-product");
    }
);

app.post(
    "/admin/add-product",
    authMiddleware,
    upload.array("productImages", 8),
    addProduct
);

// ==========================================
// MANAGE PRODUCTS
// ==========================================
app.get(
    "/admin/manage-products",
    authMiddleware,
    async (req, res) => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            const products = (data || []).map(formatProduct);
            res.render("manage-products", { products });
        } catch (error) {
            console.error(error);
            res.status(500).send("Unable to load products");
        }
    }
);

app.get(
    "/admin/products",
    authMiddleware,
    (req, res) => {
        res.redirect("/admin/manage-products");
    }
);

// ==========================================
// EDIT PRODUCT
// ==========================================
app.get(
    "/admin/edit-product/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", req.params.id)
                .maybeSingle();

            if (error) throw error;

            if (!data) {
                return res.status(404).send("Product not found");
            }

            res.render("edit-product", {
                product: formatProduct(data)
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Unable to load product");
        }
    }
);

app.post(
    "/admin/edit-product/:id",
    authMiddleware,
    upload.array("productImages", 8),
    updateProduct
);

// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProductHandler = async (req, res) => {
    try {
        const { data: product, error: findError } = await supabase
            .from("products")
            .select("*")
            .eq("id", req.params.id)
            .maybeSingle();

        if (findError) throw findError;

        if (!product) {
            return res.status(404).send("Product not found");
        }

        for (const image of product.images || []) {
            if (image.startsWith("http")) {
                try {
                    await deleteFromCloudinary(image);
                } catch (imageError) {
                    console.error("Cloudinary Delete Error:", imageError);
                }
            }
        }

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", req.params.id);

        if (error) throw error;

        res.redirect("/admin/manage-products");
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).send("Unable to delete product");
    }
};

app.get("/admin/delete-product/:id", authMiddleware, deleteProductHandler);
app.post("/admin/delete-product/:id", authMiddleware, deleteProductHandler);

// ==========================================
// ADMIN MESSAGES MANAGEMENT
// ==========================================
app.get("/admin/messages", authMiddleware, getMessages);
app.post("/admin/messages/:id/read", authMiddleware, markAsRead);
app.post("/admin/messages/:id/delete", authMiddleware, deleteMessage);

// ==========================================
// API ROUTES & HEALTH CHECK
// ==========================================
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Fresh Fashion API is running"
    });
});

// ==========================================
// 404 & SERVER
// ==========================================
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// ==========================================
// LOCAL SERVER
// ==========================================
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server Running On http://localhost:${PORT}`);
    });
}

// Vercel serverless export
module.exports = app;