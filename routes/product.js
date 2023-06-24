const router = require("express").Router();

const {
  getProducts,
  createProducts,
  updateProducts,
  getProduct,
  deleteProduct,
} = require("../controller/productController");

// const subCategoriesRoute = require("./subproduct");
// router.use("/:productId/subcategories", subCategoriesRoute);

router.route("/").get(getProducts).post(createProducts);

router.route("/:id").get(getProduct).put(updateProducts).delete(deleteProduct);

module.exports = router;
