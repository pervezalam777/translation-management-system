const path = require('path');
const fs = require('fs');
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
    const data = apiAccess[UserType.DEV].getOneLanguageFormattedJSON(repoName, lang);
    //TODO: file a way to create file in memory.
    // explore writeStream and readStream.
    const directory = path.join(__dirname, `../temp/${repoName}`);
    fs.mkdirSync(directory);
    const file = path.join(directory, `${lang}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    var filename = path.basename(file);

    res.setHeader('Content-disposition', 'attachment; filename='+filename);
    res.setHeader('Content-type', 'application/json');
    var fileReadStream = fs.createReadStream(file);
    fileReadStream.pipe(res);
  } catch(error){
    console.log('Error: on download a language As JSON file:', error.message);
    res.status(404).send('bad request')
  }
}

//Middleware for authentication change
downloadRouter.use(authValidator);

// Route for downloading all the languages as json in requested repository
downloadRouter.get('/:repoName', downloadAllLanguagesAsJSONFile);

// Route for downloading one language as json in the required repository
downloadRouter.get('/:repoName/:lang', downloadALanguageAsJSONFile)

module.exports = downloadRouter;