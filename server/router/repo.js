const path = require('path');
const express = require('express');

const {
  UserType, 
  apiAccess
} = require('../db');

const repoRouter = express.Router();

function validate(req, res, next) {
  res.locals.validated = true;
  console.log("VALIDATED")
  //TODO: 403 forbidden if user is not authorized.
  next()
}

repoRouter.use(validate);

repoRouter.post('/:repoName/add/*', (req, res) => {
  const values = req.body.values
  const repoName = req.params.repoName
  apiAccess[UserType.DEV]
    .addNewTranslation(req.params[0], values, {repoName})
  res.status(200).send({success:true})
})

//TODO: remove following 
repoRouter.get('/:repoName/add/*', (req, res) => {
  console.log("is validated ",res.locals.validated)
  console.log('rep route', req.params[0])
  res.status(200).send({success:true})
})

module.exports = repoRouter;