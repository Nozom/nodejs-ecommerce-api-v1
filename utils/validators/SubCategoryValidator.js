const joi = require("joi");
const objectId = require("joi-objectid");

// Register objectId with Joi
joi.objectId = objectId(joi);

const CreateSubCategoryValidator = (data) => {
  const cat = joi.object({
    name: joi.string().required().min(3).max(32),
    category: joi.objectId().required(),
  });
  return cat.validate(data);
};

const UpdatesubCategoryValidator = (data) => {
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
          name: joi.string().min(3).max(32).required(),
          category: joi.objectId().required(),
        })
        .unknown(true),
    })
    .unknown(true);
  return schema.validate(data);
};

const subCategoryValidatorId = (data) => {
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
  CreateSubCategoryValidator,
  UpdatesubCategoryValidator,
  subCategoryValidatorId,
};
