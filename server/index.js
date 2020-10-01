const path = require('path');
const express = require('express');
const helmet = require('helmet');

const authRouter = require('./router/auth');
const repoRouter = require('./router/repo')

const app = express();
app.use(helmet());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use('/user', authRouter);
app.use('/repo', repoRouter);
app.all('*', (req, res) => {
  console.log('Error: 404', req.url)
  res.status(404).send('does not exits')
})

const port = process.env.PORT || 5000;
app.listen(port, err => {
  if(err){
    console.error(`Server failed to start ${err.message}`);
    return;
  }
  console.log(`server started at port ${port}`);
});