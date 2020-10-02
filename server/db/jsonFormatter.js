const { db, rootKeys } = require('./db')
const { getSupportedLanguages } = require('./language')

/**
 * Format to json translation
 * @param {Object} data 
 */
function formatToJSON(data) {
  let language = {}
  const keys = Object.keys(data);
  for(let key of keys){
    const meta = data[key];
    if(meta.value){
      language[key] = meta.value
    } else {
      language[key] = formatToJSON(data[key])
    }
  }
  return language;
}

/**
 * Get all language formatted json file
 * @param {String} repoName repository name
 */
function getAllLanguagesFormattedJSON(repoName){
  const languages = getSupportedLanguages(repoName);
  const repoPath = `${rootKeys.REPOSITORIES}/${repoName}`;
  const repoLanguages = {}
  for(let language of languages) {
    try {
      const data = db.getData(`${repoPath}/${language}`);
      repoLanguages[language] = formatToJSON(data)
    } catch(error){}
  }
  return repoLanguages
}

/**
 * Get one language Formatted JSON file
 * @param {String} repoName repository name
 * @param {String} language language name
 */
function getOneLanguageFormattedJSON(repoName, language){
  const path = `${rootKeys.REPOSITORIES}/${repoName}/${language}`;
  try {
    const data = db.getData(path);
    return formatToJSON(data)
  } catch(error) {
    console.log('Error: on get one language formatted json:', error.message)
  }
  return {}
}

module.exports = {
  getAllLanguagesFormattedJSON,
  getOneLanguageFormattedJSON
}