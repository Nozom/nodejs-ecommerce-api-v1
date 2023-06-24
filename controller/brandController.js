const BrandModel = require("../models/BrandModel");
const slugify = require("slugify");
const expressHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const {
  BrandValidatorId,
  CreateBrandValidator,
  UpdateBrandValidator,
} = require("../utils/validators/BrandValidator");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

/**
 * @desc Get All Brands
 * @route /api/v1/brands
 * @method GET
 * @access public
 */
const getBrands = factory.getDocs(BrandModel);
/**
 * @desc Get  Brands
 * @route /api/v1/brands/:id
 * @method GET
 * @access public
 */
const getBrand = factory.getDoc(BrandModel);
/**
 * @desc Create Brands
 * @route /api/v1/brands
 * @method POST
 * @access public
 */
const createBrands = factory.cerateDocs(BrandModel);
/**
 * @desc Update Brands
 * @route /api/v1/brands/:id
 * @method PUT
 * @access public
 */

const updateBrands = factory.updateDocs(BrandModel);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private

const deleteBrand = factory.deleteOne(BrandModel);

module.exports = {
  getBrands,
  getBrand,
  createBrands,
  updateBrands,
  deleteBrand,
};
