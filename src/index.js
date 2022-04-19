const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://pattamu:iKHwECgQCaYNVpge@sandeepcluster.9rzkh.mongodb.net/Sandeep467-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

const today = new Date().toLocaleString()

//GLOBAL Middleware API ------------>
app.use((req,res,next) => {
    // const arr = [today, req.path, req.socket.remoteAddress]//req.socket.remoteAddress or req.ip both works for getting ip
    // console.log(arr.join(', '))
    console.log(today +', '+ req.path +', '+ req.ip )//we can write this one instead of 18,19 line
    // console.log(req.originalUrl)// This is extra, comment out to check what it prints
    next();
})
//---------------------------------->

app.use('/', route);

app.listen(process.env.PORT || 4000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
});
