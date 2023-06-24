const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product Required"],
      trim: true,
      lowercase: true,
      unique: [true, "Product must be unique"],
      minlength: [20, "Too short Product name"],
      // maxlength: [200, "Too long Product name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },

    description: {
      type: String,
      required: [true, "Product Required"],
      minlength: [20, "Too short Product Description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is Required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is Required"],
      trim: true,
      // min: [10, "Too Long Product Price"],
    },
    priceAfterrDiscount: {
      type: Number,
    },
    color: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is required"],
    },
    images: [String],
    image: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Product must be belong to Category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above or equal 1.0"],
      max: [5, "rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
