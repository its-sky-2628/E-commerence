const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0
    },

    category: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    images: [
      String
    ],

    // Hero slider me dikhana hai ya nahi
    highlighted: {
      type: Boolean,
      default: false
    },

    // Slider position
    sliderOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model("Product", productSchema);