const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

const db = new JsonDB(new Config("./testDB", true, true, '/'));
const rootKeys = {
  LANGUAGES: '/languages',
  REPOSITORIES: '/repositories',
  USER: '/user'
}

module.exports = { db, rootKeys }

