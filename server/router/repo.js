const path = require('path');
const express = require('express');

const {
  UserType, 
  apiAccess
} = require('../db');

const repoRouter = express.Router();

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

/**
 * Create new repository
 * @param {Object} req http request object
 * @param {Object} res http response object
 */
function createRepo(req, res) {
  const repoName = req.params.repoName;
  try{
    apiAccess[UserType.DEV].addNewRepo(repoName, {})
    res.status(200).send({success:true})
  } catch(error) {
    res.status(409).send({success:false, error:error.message})
  }
}

/**
 * Add new language in each repository
 * @param {Object} req http request object
 * @param {Object} res http response object
 */
function addNewLanguage(req, res) {
  const langName = req.params.langName
  try {
    apiAccess[UserType.DEV].addLanguage(langName)
    res.status(200).send({success:true})
  } catch(error) {
    res.status(409).send({success:false, error:error.message})
  }
}

/**
 * Add new key and value in each language in requested repository
 * @param {Object} req http request object
 * @param {Object} res http response object
 */
function addNewKey(req, res) {
  const values = req.body.values
  const repoName = req.params.repoName
  try {
    apiAccess[UserType.DEV]
      .addNewTranslation(req.params[0], values, {repoName})
    res.status(200).send({success:true})
  } catch(error) {
    res.status(409).send({success:false, error:error.message})
  }
}

/**
 * Update all translation of a requested repository
 * @param {Object} req http request object
 * @param {Object} res http response object
 */
function updateAllTranslation(req, res) {
  const values = req.body.values
  const repoName = req.params.repoName
  try {
    apiAccess[UserType.TRANSLATOR]
      .updateAllTranslation(req.params[0], values, {repoName})
    res.status(200).send({success:true})
  } catch(error) {
    res.status(409).send({success:false, error:error.message})
  }
}

/**
 * Update one value in single language file of requested repository
 * @param {Object} req http request object
 * @param {Object} res http response object
 */
function updateOne(req, res) {
  const value = req.body.value
  const {repoName, lang} = req.params
  try {
    apiAccess[UserType.TRANSLATOR]
      .updateOneTranslation(req.params[0], value, {repoName, lang})
    res.status(200).send({success:true})
  } catch(error) {
    res.status(409).send({success:false, error:error.message})
  }
}

//Middleware for authentication change
repoRouter.use(validate);

// Route for new repository creation
repoRouter.put('/:repoName', createRepo)

// Route for adding new language
repoRouter.put('/language/:langName', addNewLanguage)

// Route for adding new key.
repoRouter.post('/:repoName/add/*', addNewKey)

// Route for updating all the translation sent by translator
repoRouter.put('/:repoName/update-all/*', updateAllTranslation);

// Route for updating only one translation sent by translator
repoRouter.put('/:repoName/update/:lang/*', updateOne)

module.exports = repoRouter;