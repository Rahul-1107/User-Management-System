require('dotenv').config();

const express=require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride= require('method-override');

const { flash }=require('express-flash-message'); 
const session= require('express-session');  //for cookies/express session

const connectDB = require('./server/config/db');


const app=express();
const port= 5000 || process.env.PORT;


//connect to database
connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));


//static files
app.use(express.static('public'));

//express session
app.use(
    session({
        secret:'secret',
        resave:false,
        saveUninitialized:true,
        cookie:{
            maxAge:1000*60*60*24*7, //1 week
        }
    })
);


//flash message
app.use(
    flash({
      sessionKeyName: 'express-flash-message'})
);


//templating engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');




//Routes
app.use('/',require('./server/routes/customer'));

//Handle 404: means to handle error which comes if we go to any page and it does not exists
app.get('*',(req,res) => {
res.status(404).render('404');
});



app.listen(port,()=>{
    console.log('App listening on port ${port}')
});