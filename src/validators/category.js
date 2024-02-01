const { body } = require("express-validator");

// registration validation
const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category Name is required.")
    .isLength({ min: 4 })
    .withMessage("Category Name should be at least 4 characters long"),
];

module.exports = {
  validateCategory,
};
