const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

const rootKeys = {
  LANGUAGES: '/languages',
  REPOSITORIES: '/repositories',
  USER: '/user'
}

const db = new JsonDB(new Config("./testDB", true, true, '/'));

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
        db.push(`${rootKeys.REPOSITORIES}/${repoName}/${newLang}`, data)
      })
    } catch(error){}
  }
}

function getInitData(){
  const languages = db.getData(rootKeys.LANGUAGES)
  return languages.reduce((pre, nextItem) => {
    pre[nextItem] = {}
    return pre;
  }, {})
}

function addNewRepo(repoName) {
  const path = `${rootKeys.REPOSITORIES}/${repoName}`
  try {
    db.getData(path);
  } catch(error) {
    // when repo does not exists
    db.push(path, getInitData())
  }
}

function addOrUpdateAll(keyName, values, repoName){
  const languages = db.getData(rootKeys.LANGUAGES);
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

module.exports = {
  dbVersion:"1.0.0",
  addLanguage,
  addNewRepo,
  addOrUpdateAll,
  updateOne
}

