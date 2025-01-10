const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const sequelize = require('./config/config');
const adminRoutes = require('./routes/admin');
const Loginroute=require("./routes/loginrout");
const multer=require("multer")
const app = express();
const fs =require('fs');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));



app.use(Loginroute);

app.use('/admin', adminRoutes);





const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }) 
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });