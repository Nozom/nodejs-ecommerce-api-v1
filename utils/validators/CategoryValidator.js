const joi = require("joi");
const objectId = require("joi-objectid");

// Register objectId with Joi
joi.objectId = objectId(joi);

const CreateCategoryValidator = (data) => {
  const cat = joi.object({
    name: joi.string().required().min(3).max(32),
  });
  return cat.validate(data);
};

const UpdateCategoryValidator = (data) => {
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
        })
        .unknown(true),
    })
    .unknown(true);
  return schema.validate(data);
};

const categoryValidatorId = (data) => {
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
  CreateCategoryValidator,
  UpdateCategoryValidator,
  categoryValidatorId,
};
