
/**
 * Validate the incoming request ton repo router
 * @param {Object} req http request object
 * @param {Object} res http response object
 * @param {Function} next move to next middleware.
 */
function validate(req, res, next) {
  res.locals.validated = true;
  console.log("VALIDATED")
  //TODO: 403 forbidden if user is not authorized.
  next()
}


module.exports = validate;