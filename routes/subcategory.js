const {
  getSubCategories,
  getSubCategory,
  createSubCategories,
  updateSubCategories,
  deleteSubCategory,
} = require("../controller/subCategoryController");

// mergeParams Allow us to access parameters on other routes
const router = require("express").Router({ mergeParams: true });

router.route("/").get(getSubCategories).post(createSubCategories);

router
  .route("/:id")
  .get(getSubCategory)
  .put(updateSubCategories)
  .delete(deleteSubCategory);

module.exports = router;
