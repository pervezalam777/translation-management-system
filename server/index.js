const {
  dbVersion, 
  addLanguage, 
  addNewRepo, 
  addOrUpdateAll,
  updateOne,
  getRepoNames,
  getRepoLanguages

} = require('./db');
console.log('working...', dbVersion)

addLanguage('en-in');
addLanguage('hi-in');

addNewRepo('ebook-ui');
addNewRepo('storefront-ui');

addOrUpdateAll('toc', {
  'en-in':'Table of Content',
  'hi-in':'विषयसूची'
}, 'ebook-ui')

addOrUpdateAll('navBar/search', {
  'en-in':'Search',
  'hi-in':'खोजें'
}, 'ebook-ui')

addLanguage('bn-in');

updateOne('toc', 'সূচি তালিকা', 'ebook-ui', 'bn-in')
updateOne('todo', 'সূচি তালিকা', 'ebook-ui', 'bn-in')

const repositories = getRepoNames();
console.log('repositories', repositories);

const repoLanguages = getRepoLanguages(repositories[0]);
console.log('repo languages..', repoLanguages)