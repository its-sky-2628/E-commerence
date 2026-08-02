require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const seedProducts = async () => {
    try {

        await mongoose.connect(
    process.env.MONGO_URI
);

        console.log("✅ MongoDB Connected");

        const products = [
            {
                name: "Classic Everyday T-Shirt",
                price: 999,
                discount: 20,
                category: "Men",
                description:
                    "Comfortable everyday casual T-shirt.",

                images: [
                    "default-product-1.webp"
                ],

                highlighted: true,
                sliderOrder: 1
            },

            {
                name: "Premium Casual Wear",
                price: 1299,
                discount: 15,
                category: "Men",
                description:
                    "Modern casual wear for everyday styling.",

                images: [
                    "default-product-2.webp"
                ],

                highlighted: true,
                sliderOrder: 2
            },

            {
                name: "Everyday Essential",
                price: 1499,
                discount: 10,

                // Tumhare current admin model/forms
                // Men/Kids use kar rahe hain
                category: "Kids",

                description:
                    "Simple and stylish everyday fashion.",

                images: [
                    "default-product-3.webp"
                ],

                highlighted: true,
                sliderOrder: 3
            },

            {
                name: "Fresh Studio T-Shirt",
                price: 1199,
                discount: 25,
                category: "Men",
                description:
                    "Fresh modern T-shirt for everyday comfort.",

                images: [
                    "default-product-4.webp"
                ],

                highlighted: true,
                sliderOrder: 4
            }
        ];

        // Duplicate seed se bachne ke liye
        const existing =
            await Product.countDocuments();

        if (existing > 0) {
            console.log(
                `⚠️ Database already has ${existing} product(s).`
            );

            console.log(
                "Seed cancelled to avoid duplicates."
            );

            return;
        }

        await Product.insertMany(products);

        console.log(
            "✅ 4 default products added successfully"
        );

    } catch (error) {

        console.error(
            "❌ Seed Error:",
            error
        );

    } finally {

        await mongoose.disconnect();

        console.log(
            "MongoDB disconnected"
        );
    }
};

seedProducts();