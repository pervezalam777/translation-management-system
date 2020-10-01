const path = require('path');
const express = require('express');

const authValidator = require('./authValidator');

const {
  UserType, 
  apiAccess
} = require('../db');

const downloadRouter = express.Router();

/**
 * Download all languages as JSON file format
 * @param {Object} req Http request object
 * @param {Object} res Http response object
 */
function downloadAllLanguagesAsJSONFile(req, res) {
  const repoName = req.params.repoName;
  try {
    const data = apiAccess[UserType.DEV].getAllLanguagesFormattedJSON(repoName)
    //TODO: code for download as file
    res.status(200).send(data)
  } catch(error){
    res.status(404).send('bad request')
  }
}

/**
 * Download a language as JSON file format
 * @param {Object} req Http request object
 * @param {Object} res Http response object
 */
function downloadALanguageAsJSONFile(req, res) {
  const {repoName, lang} = req.params;
  try {
    const data = apiAccess[UserType.DEV].getOneLanguageFormattedJSON(repoName, lang)
    //TODO: code for download as file
    res.status(200).send(data)
  } catch(error){
    res.status(404).send('bad request')
  }
}

//Middleware for authentication change
repoRouter.use(authValidator);

// Route for downloading all the languages as json in requested repository
downloadRouter.get('/:repoName', downloadAllLanguagesAsJSONFile);

// Route for downloading one language as json in the required repository
downloadRouter.get('/:repoName/:lang', downloadALanguageAsJSONFile)