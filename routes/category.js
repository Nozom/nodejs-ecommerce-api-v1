const router = require("express").Router();

const {
  getCategories,
  createCategories,
  updateCategories,
  getCategory,
  deleteCategory,
} = require("../controller/categoryController");

const subCategoriesRoute = require("./subcategory");
router.use("/:categoryId/subcategories", subCategoriesRoute);

router.route("/").get(getCategories).post(createCategories);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategories)
  .delete(deleteCategory);

module.exports = router;
