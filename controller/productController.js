const ProductModel = require("../models/ProductModel");
const slugify = require("slugify");
const expressHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const {
  productValidatorId,
  CreateProductValidator,
  UpdateProductValidator,
} = require("../utils/validators/ProductValidator");
const { deleteOne, getDoc, getDocs } = require("./handlersFactory");
/**
 * @desc Get All Product
 * @route /api/v1/products
 * @method GET
 * @access public
 */

const getProducts = getDocs(ProductModel, "Products");

/**
 * @desc Get  Product
 * @route /api/v1/products/:id
 * @method GET
 * @access public
 */

const getProduct = getDoc(ProductModel);

/**
 * @desc Create Product
 * @route /api/v1/products
 * @method POST
 * @access public
 */

const createProducts = expressHandler(async (req, res, next) => {
  const { error } = CreateProductValidator(req.body, req);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body.slug = slugify(req.body.title);
  const product = await new ProductModel(req.body);
  await product.save();
  console.log(product);
  res.status(201).json({ data: product });
});

/**
 * @desc Update Product
 * @route /api/v1/products/:id
 * @method PUT
 * @access public
 */
const updateProducts = expressHandler(async (req, res, next) => {
  const { error } = UpdateProductValidator(req);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);
  const product = await ProductModel.findById(id);
  if (product) {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    res.status(200).json({ data: updatedProduct });
  } else {
    return next(new ApiError(`no product for this id ${id}`, 404));
  }
});

/**
 * @desc Delete Product
 * @route /api/v1/products/:id
 * @method Delete
 * @access public
 */
const deleteProduct = deleteOne(ProductModel);
module.exports = {
  getProducts,
  getProduct,
  createProducts,
  updateProducts,
  deleteProduct,
};
