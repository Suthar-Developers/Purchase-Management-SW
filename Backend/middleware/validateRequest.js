const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Request validation failed', errors: result.error.flatten() });
  req[source] = result.data;
  next();
};
module.exports = validate;
