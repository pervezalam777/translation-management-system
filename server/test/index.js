const {
  UserType, 
  apiAccess
} = require('../db');

apiAccess[UserType.DEV].addLanguage('en-in');
apiAccess[UserType.DEV].addLanguage('hi-in');

apiAccess[UserType.DEV].addNewRepo('ebook-ui');
apiAccess[UserType.DEV].addNewRepo('storefront-ui');

apiAccess[UserType.DEV].addNewTranslation('toc', {
  'en-in':'Table of Content',
  'hi-in':'विषयसूची'
}, 'ebook-ui')

apiAccess[UserType.DEV].addNewTranslation('navBar/search', {
  'en-in':'Search',
  'hi-in':'खोजें'
}, 'ebook-ui')

apiAccess[UserType.DEV].addLanguage('bn-in');

apiAccess[UserType.TRANSLATOR].updateOneTranslation('toc', 'সূচি তালিকা', {repoName:'ebook-ui', lang:'bn-in'})
apiAccess[UserType.TRANSLATOR].updateOneTranslation('todo', 'সূচি তালিকা', {repoName:'ebook-ui', lang:'bn-in'})

const repositories = apiAccess[UserType.DEV].getRepoNames();
console.log('repositories', repositories);

const repoLanguages = apiAccess[UserType.DEV].getSupportedLanguagesIn(repositories[0]);
console.log('repo languages..', repoLanguages)