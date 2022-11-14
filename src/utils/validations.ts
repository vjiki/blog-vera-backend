import { body } from "express-validator";

const blogCreateValidation = [
  body("title", "Specify title").isLength({ min: 3 }).isString(),
  body("content", "Content shall be not empty")
    .isLength({
      min: 10,
    })
    .isString(),
  body("tags", "Invalid tag format (use array)").optional().isArray(),
  body("imageUrl", "Invalid URL to image").optional().isString(),
];

export default blogCreateValidation;