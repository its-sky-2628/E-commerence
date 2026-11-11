const supabase = require("../config/supabase");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const deleteFromCloudinary = require("../utils/cloudinaryDelete");

const formatProduct = (row) => ({
    ...row,
    _id: row.id,
    sliderOrder: row.slider_order,
    createdAt: row.created_at
});

const getAllProducts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        const products = (data || []).map(formatProduct);

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch products"
        });
    }
};

const getSingleProduct = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", req.params.id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product: formatProduct(data)
        });
    } catch (error) {
        console.error("Get Single Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch product"
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const images = [];

        if (req.files?.length) {
            for (const file of req.files) {
                const uploaded = await uploadToCloudinary(file.buffer);
                images.push(uploaded.url);
            }
        }

        const productData = {
            name: req.body.name,
            price: Number(req.body.price),
            discount: Number(req.body.discount) || 0,
            category: req.body.category,
            description: req.body.description,
            images,
            highlighted:
                req.body.highlighted === "on" ||
                req.body.highlighted === "true",
            slider_order: Number(req.body.sliderOrder) || 0
        };

        const { data, error } = await supabase
            .from("products")
            .insert(productData)
            .select()
            .single();

        if (error) throw error;

        if (req.originalUrl.startsWith("/admin/")) {
            return res.redirect("/admin/manage-products");
        }

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: formatProduct(data)
        });
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to add product"
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { data: existing, error: findError } = await supabase
            .from("products")
            .select("*")
            .eq("id", req.params.id)
            .maybeSingle();

        if (findError) throw findError;

        if (!existing) {
            return res.status(404).send("Product not found");
        }

        const updates = {
            name: req.body.name,
            price: Number(req.body.price),
            discount: Number(req.body.discount) || 0,
            category: req.body.category,
            description: req.body.description,
            highlighted:
                req.body.highlighted === "on" ||
                req.body.highlighted === "true",
            slider_order: Number(req.body.sliderOrder) || 0,
            updated_at: new Date().toISOString()
        };

        if (req.files?.length) {
            for (const image of existing.images || []) {
                if (image.startsWith("http")) {
                    try {
                        await deleteFromCloudinary(image);
                    } catch (err) {
                        console.error("Old image deletion error:", err);
                    }
                }
            }

            updates.images = [];

            for (const file of req.files) {
                const uploaded = await uploadToCloudinary(file.buffer);
                updates.images.push(uploaded.url);
            }
        }

        const { data, error } = await supabase
            .from("products")
            .update(updates)
            .eq("id", req.params.id)
            .select()
            .single();

        if (error) throw error;

        if (req.originalUrl.startsWith("/admin/")) {
            return res.redirect("/admin/manage-products");
        }

        res.json({
            success: true,
            message: "Product updated successfully",
            product: formatProduct(data)
        });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).send("Unable to update product");
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { data: product, error: findError } = await supabase
            .from("products")
            .select("*")
            .eq("id", req.params.id)
            .maybeSingle();

        if (findError) throw findError;

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        for (const image of product.images || []) {
            if (image.startsWith("http")) {
                try {
                    await deleteFromCloudinary(image);
                } catch (err) {
                    console.error("Cloudinary Delete Error:", err);
                }
            }
        }

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", req.params.id);

        if (error) throw error;

        res.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete product"
        });
    }
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct
};
