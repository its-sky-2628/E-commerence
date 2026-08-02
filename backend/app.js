require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const Product = require("./models/Product");
const Contact = require("./models/Contact");

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

const app = express();
const PORT = process.env.PORT || 5001;

// ==========================================
// DATABASE
// ==========================================
connectDB();

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
        const products = await Product
            .find()
            .sort({ createdAt: -1 })
            .limit(8);

        res.render("index", { products });
    } catch (error) {
        console.error(error);
        res.render("index", { products: [] });
    }
});

// ==========================================
// LOGIN & LOGOUT
// ==========================================
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (
        email === "admin@freshfashion.com" &&
        password === "Shreyansh"
    ) {
        const token = jwt.sign(
            { email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax"
        });

        return res.redirect("/admin");
    }

    return res.status(401).send("Invalid Email or Password");
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

// ==========================================
// ADMIN DASHBOARD (UPDATED SINGLE ROUTE)
// ==========================================
app.get(
    "/admin",
    authMiddleware,
    async (req, res) => {
        try {
            const [
                totalProducts,
                totalMessages,
                newMessages,
                menProducts,
                kidsProducts
            ] = await Promise.all([
                Product.countDocuments(),
                Contact.countDocuments(),
                Contact.countDocuments({ status: "new" }),
                Product.countDocuments({ category: "Men" }),
                Product.countDocuments({ category: "Kids" })
            ]);

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
            const products = await Product
                .find()
                .sort({ createdAt: -1 });

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
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).send("Product not found");
            }

            res.render("edit-product", { product });
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
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.images && product.images.length > 0) {
                product.images.forEach(image => {
                    const imagePath = path.join(__dirname, "public/uploads", image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
            }
            await product.deleteOne();
        }

        res.redirect("/admin/manage-products");
    } catch (error) {
        console.error(error);
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