const express = require("express");

const router = express.Router();

const {
    getAllProducts,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const upload =
    require("../middleware/uploadMiddleware");

const authMiddleware =
    require("../middleware/authMiddleware");

// PUBLIC
router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);

// ADMIN API
router.post(
    "/",
    authMiddleware,
    upload.array("productImages", 8),
    addProduct
);

router.put(
    "/:id",
    authMiddleware,
    upload.array("productImages", 8),
    updateProduct
);

router.delete(
    "/:id",
    authMiddleware,
    deleteProduct
);

module.exports = router;