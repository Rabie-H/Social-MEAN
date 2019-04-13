const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

const users = require('./routes/users.route');
const config = require('./config/database');
const port = 3000;

const app = express();


mongoose.connect(config.database);
mongoose.connection.on('connected', () =>{
    console.log('Successfully Connected To DataBase',config.database);
});
mongoose.connection.on('error', (err) => {
    console.log('An Error Occured', err);
})
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', users);

app.get('/', (req, res) => {
    res.send('Welcome To Our Website ! Please Enter a Valid End-Point')
});

app.listen(port, ()=>{
    console.log('Server listening on port ', port)
});