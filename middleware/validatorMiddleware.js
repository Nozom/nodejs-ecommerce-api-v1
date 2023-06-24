// const ValidatorMaiddleware = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).josn({ errors: errors.array() });
//   }
//   next();
// };

// module.exports = ValidatorMaiddleware;

const joi = require("joi");

module.exports = (cat, req, res, next) => {
  const { error } = cat.validate(req, cat);

  if (error) return res.status(400).json({ error: error.details[0].message });

  next(); // execute the controller logic
};
