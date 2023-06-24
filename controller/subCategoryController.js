const CategoryModel = require("../models/CategoryModel");
const SubCategoryModel = require("../models/SubCategoryModel");
const slugify = require("slugify");
const expressHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const {
  CreateSubCategoryValidator,
  UpdatesubCategoryValidator,
  subCategoryValidatorId,
} = require("../utils/validators/SubCategoryValidator");
const ApiFeatures = require("../utils/apiFeatures");
const { deleteOne, updateDocs, getDoc } = require("./handlersFactory");

/**
 * @desc Get All SubCategories
 * @route /api/v1/categories
 * @method GET
 * @access public
 */
const getSubCategories = expressHandler(async (req, res, next) => {
  let documentsCount = await SubCategoryModel.countDocuments();
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
    var apiFeatures = new ApiFeatures(
      SubCategoryModel.find(filterObj),
      req.query
    )
      .paginate(documentsCount)
      .filter()
      .search()
      .fields()
      .sort();
  } else {
    var apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
      .paginate(documentsCount)
      .filter()
      .search()
      .fields()
      .sort();
  }

  let { mongooseQuery, paginationResult } = apiFeatures;

  const categories = await mongooseQuery;
  if (categories.length == 0) {
    return next(new ApiError(`no Subcategories`, 404));
  }
  res
    .status(200)
    .json({ result: categories.length, paginationResult, data: categories });
});

/**
 * @desc Get  subCategory
 * @route /api/v1/categories/:id
 * @method GET
 * @access public
 */

const getSubCategory = getDoc(SubCategoryModel);
/**
 * @desc Create subCategory
 * @route /api/v1/categories
 * @method POST
 * @access public
 */

const createSubCategories = expressHandler(async (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;

  const { error } = CreateSubCategoryValidator(req.body);
  if (error) {
    return res.status(400).json({ error });
  }
  const { name, category } = req.body;
  const subCategories = await new SubCategoryModel({
    name,
    category,
    slug: slugify(name),
  });
  await subCategories.save();
  console.log(subCategories);
  res.status(201).json({ data: subCategories });
});

/**
 * @desc Update subCategory
 * @route /api/v1/categories/:id
 * @method PUT
 * @access public
 */
const updateSubCategories = updateDocs(SubCategoryModel);

/**
 * @desc Delete subCategory
 * @route /api/v1/categories/:id
 * @method Delete
 * @access public
 */
const deleteSubCategory = deleteOne(SubCategoryModel);

module.exports = {
  getSubCategories,
  getSubCategory,
  createSubCategories,
  updateSubCategories,
  deleteSubCategory,
};
