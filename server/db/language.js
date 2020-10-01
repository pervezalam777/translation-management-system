const { db, rootKeys } = require('./db')

const TranslationStatus = {
  IN_REVIEW: 'in review',
  APPROVED: 'approved',
  LOCKED: 'locked'
}

/**
 * Get supported languages in the requested repository
 * @param {String} repoName repository name
 */
function getSupportedLanguages(repoName){
  try {  
    const meta = db.getData(`${rootKeys.REPOSITORIES}/${repoName}/meta`);
    if(meta.useLocalLanguages){
      return meta.languages
    }
  } catch(error){
    console.log('Info: on get supported language: repo does not have its own language set')
  }

  try {
    return db.getData(rootKeys.LANGUAGES);
  } catch(error) {
    console.log('Info: on get supported language: global languages list is not available')
  }

  return []
}

/**
 * Add language to global scope 
 * @param {String} langName language name
 */
function addLanguage(langName) {
  let data = []
  try{
    data = db.getData(rootKeys.LANGUAGES) || []
  } catch(err){}

  if(!data.includes(langName)){
    data.push(langName)
    db.push(rootKeys.LANGUAGES, data);
    addLanguageToRepo(langName, data[0])
  } else {
    const error = `${langName} is already exists`;
    console.log(`Error: on add Language: ${error}`)
    throw new Error(error)
  }
}

/**
 * Add language to repositories on new language addition in global scope
 * It add language those repositories which does not have their own language set
 * @param {} newLang 
 * @param {*} baseLang 
 */
function addLanguageToRepo(newLang, baseLang) {
  if(newLang != baseLang){
    try{
      const repoKeys = Object.keys(db.getData(rootKeys.REPOSITORIES))
      repoKeys.forEach(repoName => {
        const data = db.getData(`${rootKeys.REPOSITORIES}/${repoName}/${baseLang}`);
        db.push(`${rootKeys.REPOSITORIES}/${repoName}/${newLang}`, JSON.parse(JSON.stringify(data)))
      })
    } catch(error){}
  }
}

/**
 * Get initial data while creating a new repository
 * @param {String} repoName repository name 
 * @param {Object} meta repository meta information
 */
function getInitData(repoName, meta={}){
  const languages = meta.languages || getSupportedLanguages(repoName);
  return languages.reduce((pre, nextItem) => {
    pre[nextItem] = {}
    return pre;
  }, {
    meta:{
      ...meta,
      invalidated: true,
      useLocalLanguages: !!meta.languages 
    }
  })
}

/**
 * Add new repo if it is not already exists.
 * @param {String} repoName repository name
 * @param {Object} meta contains meta information of repository
 */
function addNewRepo(repoName, meta) {
  const path = `${rootKeys.REPOSITORIES}/${repoName}`;
  try {
    db.getData(path);
  } catch(error) {
    db.push(path, getInitData(repoName, meta));
    return;
  }
  console.log('Error: on add repo: repository already exits');
  throw new Error(`${repoName} already exits`);

}

/**
 * Add meta to translation value for each language.
 * @param {String} value translation value
 */
function addMetaToTranslationValue(value) {
  const date = new Date().toUTCString();
  return {
    //TODO: Replace it with value$$ to avoid 'value' to be use as key
    value,
    status: TranslationStatus.IN_REVIEW,
    addedDate: date,
    updatedDate: date
  }
}

/**
 * Add new translation values for a key in requested repository
 * @param {String} keyName Key name that that will be added as key in db
 * @param {Object} values language name as key and value could be anything
 * @param {Object} options contains repository name
 */
function addNewTranslation(keyName, values, options){
  const {repoName=''} =  options;
  let alreadyExists = false;
  const languages = getSupportedLanguages(repoName);
  for(let lang of languages){
    let path = `${rootKeys.REPOSITORIES}/${repoName}/${lang}/${keyName}`;
    try{
      const data = db.getData(path);
      alreadyExists = true;
      break;
    } catch(error){
      if(values[lang]){
        const value = addMetaToTranslationValue(values[lang]);
        db.push(path, value);
      } else {
        console.log(`Info: on add new translation: ${keyName} value missing for ${lang}`);
        const value = addMetaToTranslationValue('');
        db.push(path, value);
      }
    }
  }
  if(alreadyExists){
    const error = `${keyName} already exits`;
    console.log(`Error: on add new translation: ${error}`);
    throw new Error(error);
  }
}

/**
 * Update all translation values for a key in requested repository
 * @param {String} keyName Key name that that will be added as key in db
 * @param {Object} values language name as key and value could be anything
 * @param {Object} options contains repository name
 */
function updateAllTranslation(keyName, values, options){
  const {repoName=''} =  options
  const languages = getSupportedLanguages(repoName)
  for(let lang of languages){
    let path = `${rootKeys.REPOSITORIES}/${repoName}/${lang}/${keyName}`;
    try{
      const data = db.getData(path);
      if(values[lang] && data != values[lang]){
        data.value = values[lang];
        db.push(path, data);
      }
    } catch(error) {
      console.log('Error: on update all translation', error.message);
      throw new Error(`${keyName} does not exists`);
    }
  }
}

/**
 * Update one language record in requested repository
 * @param {String} keyName key name
 * @param {String} value language string value 
 * @param {Object} options contains repository and language name
 */
function updateOne(keyName, value, options) {
  const {repoName='', lang=''} = options;
  const path = `${rootKeys.REPOSITORIES}/${repoName}/${lang}/${keyName}`;
  console.log('path', path)
  try {
    const data = db.getData(path);
    if(data != value ){
      data.value = value;
      db.push(path, data);
    }
  } catch(error){
    console.log(`Error: on update one entry: `,error.message);
    throw new Error(`${keyName} does not exists`);
  }
}

/**
 * Get supported language in requested repository
 * @param {String} repoName repository name 
 */
function getSupportedLanguagesIn(repoName){
  const path = `${rootKeys.REPOSITORIES}/${repoName}`;
  try {
    const data = db.getData(path);
    const languages = getSupportedLanguages(repoName);
    return languages.reduce((languages, langKey) => {
      languages[langKey] = data[langKey]
      return languages
    }, {});
  } catch(error){
    console.log('error: on get repo languages', error.message);
  }
  return null;
}

/**
 * Get repositories names in database
 */
function getRepoNames() {
  try {
    const data = db.getData(`${rootKeys.REPOSITORIES}`);
    return Object.keys(data);
  } catch(error){
    console.log('error: on get repo name', error.message);
  }
  return []
}

/**
 * Add or update metadata information
 * @param {String} repoName repository name 
 * @param {String} keyName key name
 * @param {*} value any valid serializable data type 
 */
function addOrUpdateMetadata(repoName, keyName, value){
  const path = `${rootKeys.REPOSITORIES}/${repoName}/meta/${keyName}`;
  db.push(path, value);
}

/**
 * Get metadata of repository
 * @param {String} repoName repository name
 */
function getMetadata(repoName){
  try {
    const path = `${rootKeys.REPOSITORIES}/${repoName}/meta`;
    return db.getData(path)
  } catch(error) {
    console.log('Error: on get metadata', error.message);
  }
  return null
}

/**
 * Get metadata key value of requested repository
 * @param {String} repoName repository name 
 * @param {String} keyName key name
 */
function getMetadataKeyValue(repoName, keyName) {
  try {
    const path = `${rootKeys.REPOSITORIES}/${repoName}/meta/${keyName}`;
    return db.getData(path)
  } catch(error) {
    console.log('Error: on get metadata key value', error.message);
  }
  return null
}

/**
 * Delete key from requested repository
 * @param {String} repoName repository name
 * @param {String} keyName key name
 */
function deleteKey(repoName, keyName){
  try {
    const repoPath = `${rootKeys.REPOSITORIES}/${repoName}`;
    const languages = getSupportedLanguages(repoName);
    for(let langKey of languages){
      const path = `${repoPath}/${langKey}/${keyName}`
      db.delete(path);
    }
    return true;
  } catch(error){
    console.log('Error: on delete key in repo', error.message);
  }
  return false;
}

/**
 * Delete metadata key from the requested repository
 * @param {String} repoName repository name
 * @param {String} keyName key name
 */
function deleteMetaKey(repoName, keyName){
  try {
    const path = `${rootKeys.REPOSITORIES}/${repoName}/meta/${keyName}`;
    db.delete(path);
    return true
  } catch(error){
    console.log('Error: on meta key delete', error.message);
  }
  return false;
}

module.exports = {
  dbVersion:"1.0.0",
  addLanguage,
  addNewRepo,
  addNewTranslation,
  updateAllTranslation,
  updateOne,
  getSupportedLanguages,
  getSupportedLanguagesIn,
  getRepoNames,
  addOrUpdateMetadata,
  getMetadata,
  getMetadataKeyValue,
  deleteMetaKey,
  deleteKey
}

