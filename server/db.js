const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

const rootKeys = {
  LANGUAGES: '/languages',
  REPOSITORIES: '/repositories',
  USER: '/user'
}

const db = new JsonDB(new Config("./testDB", true, true, '/'));

function getLanguagesInRepo(repoName){
  try{  
    const meta = db.getData(`${rootKeys.REPOSITORIES}/${repoName}/meta`);
    if(meta.useLocalLanguages){
      return meta.languages
    } else {
      return db.getData(rootKeys.LANGUAGES);
    }
  }catch(error){}
  return []
}

function addLanguage(langName) {
  let data = []
  try{
    data = db.getData(rootKeys.LANGUAGES) || []
  } catch(err){}

  if(!data.includes(langName)){
    data.push(langName)
    db.push(rootKeys.LANGUAGES, data);
    updateEachRepo(langName, data[0])
  } else {
    console.log(`${langName} is already exists`)
  }
}

function updateEachRepo(newLang, baseLang) {
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

function getInitData(repoName, meta){
  const languages = getLanguagesInRepo(repoName) //db.getData(rootKeys.LANGUAGES)
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

function addNewRepo(repoName, meta) {
  const path = `${rootKeys.REPOSITORIES}/${repoName}`
  try {
    db.getData(path);
  } catch(error) {
    // when repo does not exists
    db.push(path, getInitData(repoName, meta))
  }
}

function addOrUpdateAll(keyName, values, repoName){
  const languages = getLanguagesInRepo(repoName) //db.getData(rootKeys.LANGUAGES);
  for(let lang of languages){
    let path = `${rootKeys.REPOSITORIES}/${repoName}/${lang}/${keyName}`;
    if(values[lang]){
      db.push(path, values[lang])
    }
  }
}

function updateOne(keyName, value, repoName, lang) {
  const path = `${rootKeys.REPOSITORIES}/${repoName}/${lang}/${keyName}`;
  try {
    const data = db.getData(path);
    if(data != value ){
      db.push(path, value);
    }
  } catch(error){
    console.log(`Error: on update one entry: `,error.message)
  }
}

function getRepoLanguages(repoName){
  const path = `${rootKeys.REPOSITORIES}/${repoName}`;
  try {
    const data = db.getData(path);
    const languages = getLanguagesInRepo(repoName); //db.getData(rootKeys.LANGUAGES)
    return languages.reduce((languages, langKey) => {
      languages[langKey] = data[langKey]
      return languages
    }, {});
  } catch(error){
    console.log('error: on get repo languages', error.message);
  }
  return null;
}

function getRepoNames() {
  try {
    const data = db.getData(`${rootKeys.REPOSITORIES}`);
    return Object.keys(data);
  } catch(error){
    console.log('error: on get repo name', error.message);
  }
  return []
}

function updateRepoMeta(repoName, keyName, value){
  const path = `${rootKeys.REPOSITORIES}/${repoName}/meta/${keyName}`;
  db.push(path, value);
}

function deleteKey(repoName, keyName){
  try {
    const repoPath = `${rootKeys.REPOSITORIES}/${repoName}`;
    const languages = getLanguagesInRepo(repoName); //db.getData(rootKeys.LANGUAGES);
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
  addOrUpdateAll,
  updateOne,
  getRepoLanguages,
  getRepoNames,
  updateRepoMeta,
  deleteMetaKey,
  deleteKey
}

