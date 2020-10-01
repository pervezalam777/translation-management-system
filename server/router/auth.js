const path = require('path');

const express = require('express');

const authRouter = express.Router();

authRouter.post('/login', (req, res, next) => {
  console.log('login route')
})

authRouter.get('/logout', (req, res, next) => {
  console.log('logout route')
})

authRouter.post('/signin', (req, res, next) => {
  console.log('login route')
})

module.exports = authRouter;