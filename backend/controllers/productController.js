const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getAllProducts = async (req, res) => {
    try {
        const products = await Product
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error(
            "Get Products Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch products"
        });
    }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const getSingleProduct = async (req, res) => {
    try {

        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        console.error(
            "Get Single Product Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch product"
        });
    }
};


// ==========================================
// ADD PRODUCT
// ==========================================
const addProduct = async (req, res) => {
    try {

        // Uploaded images
        const images = req.files
            ? req.files.map(
                file => file.filename
            )
            : [];

        // Create product
        const product = await Product.create({

            name: req.body.name,

            price:
                Number(req.body.price),

            discount:
                Number(req.body.discount) || 0,

            category:
                req.body.category,

            description:
                req.body.description,

            images,

            // ==================================
            // HERO SLIDER
            // ==================================

            // Checkbox checked = true
            highlighted:
                req.body.highlighted === "on" ||
                req.body.highlighted === "true",

            // Slider position
            sliderOrder:
                Number(req.body.sliderOrder) || 0
        });


        // Admin form se add hua
        if (
            req.originalUrl.startsWith(
                "/admin/"
            )
        ) {
            return res.redirect(
                "/admin/manage-products"
            );
        }


        // API se add hua
        res.status(201).json({
            success: true,
            message:
                "Product added successfully",
            product
        });

    } catch (error) {

        console.error(
            "Add Product Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to add product"
        });
    }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (req, res) => {
    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res
                .status(404)
                .send(
                    "Product not found"
                );
        }


        // ==================================
        // BASIC PRODUCT DETAILS
        // ==================================

        product.name =
            req.body.name;

        product.price =
            Number(req.body.price);

        product.discount =
            Number(req.body.discount) || 0;

        product.category =
            req.body.category;

        product.description =
            req.body.description;


        // ==================================
        // HERO SLIDER SETTINGS
        // ==================================

        product.highlighted =
            req.body.highlighted === "on" ||
            req.body.highlighted === "true";

        product.sliderOrder =
            Number(
                req.body.sliderOrder
            ) || 0;


        // ==================================
        // NEW IMAGES UPLOADED
        // ==================================

        if (
            req.files &&
            req.files.length > 0
        ) {

            // Delete old images
            if (
                product.images &&
                product.images.length > 0
            ) {

                product.images.forEach(
                    image => {

                        const imagePath =
                            path.join(
                                __dirname,
                                "../public/uploads",
                                image
                            );


                        if (
                            fs.existsSync(
                                imagePath
                            )
                        ) {

                            fs.unlinkSync(
                                imagePath
                            );
                        }

                    }
                );
            }


            // Save new image names
            product.images =
                req.files.map(
                    file =>
                        file.filename
                );
        }


        // ==================================
        // SAVE
        // ==================================

        await product.save();


        // Admin form update
        if (
            req.originalUrl.startsWith(
                "/admin/"
            )
        ) {

            return res.redirect(
                "/admin/manage-products"
            );
        }


        // API response
        res.json({
            success: true,
            message:
                "Product updated successfully",
            product
        });


    } catch (error) {

        console.error(
            "Update Product Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update product"
        });
    }
};


// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {
    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res
                .status(404)
                .json({
                    success: false,
                    message:
                        "Product not found"
                });
        }


        // ==================================
        // DELETE PRODUCT IMAGES
        // ==================================

        if (
            product.images &&
            product.images.length > 0
        ) {

            product.images.forEach(
                image => {

                    const imagePath =
                        path.join(
                            __dirname,
                            "../public/uploads",
                            image
                        );


                    if (
                        fs.existsSync(
                            imagePath
                        )
                    ) {

                        fs.unlinkSync(
                            imagePath
                        );
                    }

                }
            );
        }


        // ==================================
        // DELETE FROM DATABASE
        // ==================================

        await product.deleteOne();


        res.json({
            success: true,
            message:
                "Product deleted successfully"
        });


    } catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to delete product"
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    getAllProducts,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct
};