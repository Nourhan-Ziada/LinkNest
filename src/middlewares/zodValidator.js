export const zodValidate =
  (schema, property = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.errors,
      });
    }
    req[property] = result.data; // assign parsed data
    next();
  };