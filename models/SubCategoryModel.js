const mongoose = require("mongoose");

const SubCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory Required"],
      trim: true,
      lowercase: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "Too short SubCategory name"],
      maxlength: [32, "Too long SubCategory name"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to main Category"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubCategory", SubCategorySchema);
