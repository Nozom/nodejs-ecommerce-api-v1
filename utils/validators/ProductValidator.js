const joi = require("joi");
const objectId = require("joi-objectid");
const Category = require("../../models/CategoryModel");
const { ObjectId } = require("mongoose").Types;
// Register objectId with Joi
joi.objectId = objectId(joi);

const CreateProductValidator = (data, req) => {
  const pro = joi.object({
    title: joi.string().trim().min(3).required().messages({
      "string.base": "Invalid input type",
      "string.empty": "Title cannot be empty",
      "string.min": "Title should have a minimum length of {#limit}",
      "any.required": "Title is required",
    }),
    description: joi.string().trim().min(1).max(2000).required().messages({
      "string.base": "Invalid input type",
      "string.empty": "Description cannot be empty",
      "string.min": "Description should have a minimum length of {#limit}",
      "string.max": "Description should have a maximum length of {#limit}",
      "any.required": "Description is required",
    }),
    quantity: joi.number().integer().min(1).required().messages({
      "number.base": "Invalid input type",
      "number.empty": "Quantity cannot be empty",
      "number.integer": "Quantity should be an integer",
      "number.min": "Quantity should be greater than or equal to {#limit}",
      "any.required": "Quantity is required",
    }),
    sold: joi.number().integer().min(0).optional().messages({
      "number.base": "Invalid input type",
      "number.integer": "Sold should be an integer",
      "number.min": "Sold should be greater than or equal to {#limit}",
    }),
    price: joi.number().min(0).max(999999).required().messages({
      "number.base": "Invalid input type",
      "number.empty": "Price cannot be empty",
      "number.min": "Price should be greater than or equal to {#limit}",
      "number.max": "Price should be less than or equal to {#limit}",
      "any.required": "Price is required",
    }),
    priceAfterrDiscount: joi
      .number()
      .min(0)
      .max(999999)
      .when("price", {
        is: joi.number().required(),
        then: joi.number().required().less(joi.ref("price")).messages({
          "number.base": "Invalid input type",
          "number.less": "Discounted price should be less than price",
          "number.min":
            "Discounted price should be greater than or equal to {#limit}",
          "number.max":
            "Discounted price should be less than or equal to {#limit}",
        }),
        otherwise: joi.number().optional().messages({
          "number.base": "Invalid input type",
          "number.min":
            "Discounted price should be greater than or equal to {#limit}",
          "number.max":
            "Discounted price should be less than or equal to {#limit}",
        }),
      }),
    colors: joi.array().items(joi.string().trim()).optional().messages({
      "array.base": "Invalid input type",
      "array.includes": "Colors should be an array",
      "string.base": "Invalid input type",
      "string.empty": "Color cannot be empty",
      "string.trim": "Color should not have leading or trailing whitespaces",
    }),
    imageCover: joi.string().trim().min(1).required().messages({
      "string.base": "Invalid input type",
      "string.empty": "Image cover cannot be empty",
      "string.min": "Image cover should have a minimum length of {#limit}",
      "any.required": "Image cover is required",
    }),
    images: joi.array().items(joi.string().trim()).optional().messages({
      "array.base": "Invalid input type",
      "array.includes": "Images should be an array",
      "string.base": "Invalid input type",
      "string.empty": "Image cannot be empty",
      "string.trim": "Image should not have leading or trailing whitespaces",
    }),
    category: joi
      .string()
      .trim()
      .required()
      .custom(async (value, helpers) => {
        const category = await Category.findById(value);
        console.log(category);
        if (!category) {
          console.log("sa");
          return;
        }
        return value;
      })
      .messages({
        "any.required": "Category is required",
        "string.base": "Invalid input type",
        "string.empty": "Category cannot be empty",
      }),
    subcategories: joi
      .array()
      .items(
        joi
          .string()
          .trim()
          .custom((value, helpers) => {
            if (!ObjectId.isValid(value)) {
              return helpers.message("Invalid subcategory ID format");
            }
            return SubCategory.findById(value).then((subcategory) => {
              if (!subcategory) {
                return helpers.message(
                  `Subcategory with ID'${value}' does not exist`
                );
              }
            });
          })
      )
      .optional()
      .custom((values, helpers) => {
        if (!values || values.length === 0) {
          return values;
        }
        const subcategoryIds = values.filter((value) =>
          ObjectId.isValid(value)
        );
        if (subcategoryIds.length !== values.length) {
          return helpers.message("Invalid subcategory ID format");
        }
        return SubCategory.find({ _id: { $in: subcategoryIds } }).then(
          (subcategories) => {
            if (subcategories.length !== subcategoryIds.length) {
              return helpers.message("Some subcategories do not exist");
            }
            const categoryIds = subcategories.map((subcategory) =>
              subcategory.category.toString()
            );
            const categoryId = helpers.state.parent.category;
            if (!categoryIds.includes(categoryId)) {
              return helpers.message("Subcategories do not belong to category");
            }
          }
        );
      })
      .messages({
        "array.base": "Invalid input type",
        "array.includes": "Subcategories should be an array",
        "string.base": "Invalid input type",
        "string.trim":
          "Subcategory should not have leading or trailing whitespaces",
      }),
    brand: joi
      .string()
      .trim()
      .optional()
      .custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
          return helpers.message("Invalid brand ID format");
        }
      })
      .messages({
        "string.base": "Invalid input type",
        "string.trim": "Brand should not have leading or trailing whitespaces",
      }),
    ratingsAverage: joi
      .number()
      .min(1)
      .max(5)
      .precision(1)
      .optional()
      .messages({
        "number.base": "Invalid input type",
        "number.min": "Rating should be greater than or equal to {#limit}",
        "number.max": "Rating should be less than or equal to {#limit}",
        "number.precision": "Rating should have only one decimal point",
      }),
    ratingsQuantity: joi.number().integer().min(0).optional().messages({
      "number.base": "Invalid input type",
      "number.integer": "Ratings quantity should be an integer",
      "number.min":
        "Ratings quantity should be greater than or equal to {#limit}",
    }),
  });
  return pro.validate(data, { context: { req } });
};

const UpdateProductValidator = (data) => {
  const schema = joi
    .object({
      params: joi
        .object({
          id: joi
            .string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required(),
          // joi.string().guid().required(),
        })
        .unknown(true),
      body: joi
        .object({
          title: joi.string().required().min(20),
          description: joi.string().min(20),
          quantity: joi.number(),
          sold: joi.number(),
          price: joi.number().required().max(20),
          priceAfterrDiscount: joi.number().optional(),
          color: joi.string(),
          images: joi.string().optional(),
          image: joi.string(),
          category: joi.objectId().required(),
          subcategory: joi.objectId().required(),
          brand: joi.objectId().required(),
          ratingsAverage: joi.number().precision(2).min(1).max(5),
          ratingsQuantity: joi.number(),
        })
        .unknown(true),
    })
    .unknown(true);
  return schema.validate(data);
};

const productValidatorId = (data) => {
  const cat = joi.object({
    id: joi.objectId().required(),
    // id: joi
    //   .string()
    //   .required()
    //   .regex(/^[0-9a-fA-F]{24}$/, "object Id"),
  });
  return cat.validate(data);
};
module.exports = {
  CreateProductValidator,
  UpdateProductValidator,
  productValidatorId,
};
