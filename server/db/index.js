const langAPI = require('./language')
const jsonFormatter = require('./jsonFormatter')
const {addUser, UserType} = require("./user")

const publicAccess = {
  getSupportedLanguagesIn:langAPI.getSupportedLanguagesIn,
  getRepoNames: langAPI.getRepoNames,
  getAllLanguagesFormattedJSON: jsonFormatter.getAllLanguagesFormattedJSON,
  getOneLanguageFormattedJSON: jsonFormatter.getOneLanguageFormattedJSON
}

const apiAccess = {
  [UserType.DEV]: {
    addLanguage:langAPI.addLanguage,
    addNewRepo:langAPI.addNewRepo,
    addNewTranslation:langAPI.addNewTranslation,
    ...publicAccess
  },
  [UserType.REVIEWER]:{
    addLanguage:langAPI.addLanguage,
    addNewRepo:langAPI.addNewRepo,
    deleteMetaKey:langAPI.deleteMetaKey,
    deleteKey:langAPI.deleteKey,
    ...publicAccess
  },
  [UserType.TRANSLATOR]: {
    updateAllTranslation:langAPI.updateAllTranslation,
    updateOneTranslation:langAPI.updateOne,
    ...publicAccess
  },
  system: {
    addOrUpdateMetadata:langAPI.addOrUpdateMetadata,
    getMetadata:langAPI.getMetadata,
    getMetadataKeyValue:langAPI.getMetadataKeyValue
  }
}

module.exports = {
  apiAccess,
  UserType,
  addUser
}