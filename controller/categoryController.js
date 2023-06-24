const CategoryModel = require("../models/CategoryModel");
const slugify = require("slugify");
const expressHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");

const {
  deleteOne,
  getDocs,
  getDoc,
  cerateDocs,
  updateDocs,
} = require("./handlersFactory");
/**
 * @desc Get All Category
 * @route /api/v1/categories
 * @method GET
 * @access public
 */

const getCategories = getDocs(CategoryModel);

/**
 * @desc Get  Category
 * @route /api/v1/categories/:id
 * @method GET
 * @access public
 */

const getCategory = getDoc(CategoryModel);

/**
 * @desc Create Category
 * @route /api/v1/categories
 * @method POST
 * @access public
 */

const createCategories = cerateDocs(CategoryModel);

/**
 * @desc Update Category
 * @route /api/v1/categories/:id
 * @method PUT
 * @access public
 */
const updateCategories = updateDocs(CategoryModel);

/**
 * @desc Delete Category
 * @route /api/v1/categories/:id
 * @method Delete
 * @access public
 */
const deleteCategory = deleteOne(CategoryModel);

module.exports = {
  getCategories,
  getCategory,
  createCategories,
  updateCategories,
  deleteCategory,
};
