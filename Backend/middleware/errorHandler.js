const { v4: uuid } = require('uuid');

const requestId = (req, res, next) => { req.requestId = uuid(); res.setHeader('x-request-id', req.requestId); next(); };
const notFound = (req, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'Endpoint not found', requestId: req.requestId });
const errorHandler = (err, req, res, next) => {
  console.error(`[${req.requestId}]`, err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ code: err.code || 'INTERNAL_ERROR', message: status >= 500 ? 'Unable to process request' : err.message, requestId: req.requestId });
};
module.exports = { requestId, notFound, errorHandler };
