const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');


//mongoose.connect
mongoose.connect('mongodb://localhost/tmsapplication');

const db=mongoose.connection;
//sports
const port =3000;
//init app
const app = express();

const admin = require('./routes/admin');

//view setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set the static  folder
app.use(express.static(path.join(__dirname,'public')));

//express messages
app.use(require('connect-flash')());
app.use((req, res, next)=> {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator
app.use(expressValidator({
  errorFormatter:(param,msg,value)=>{
    const namespace = param.split('.')
    ,root = namespace.shift()
    , formparam = root;
    while(namespace.length) {
      formparam+= '['+namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
  }
}));

app.use('/',admin);
app.use('/login',admin);
app.use('/list_employees',admin);


app.listen(port,()=>{
  console.log('server started on port'+port);
});
