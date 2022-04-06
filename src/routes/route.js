const express = require('express');
const name = require('../logger/logger')
const date = require('../util/helper')
const sentence = require('../validator/formatter')
var _ = require('lodash');

const router = express.Router();

router.get('/test-me', function (req, res) {
    name.name()
    res.send('My first ever api!')
});

router.get('/test-date', function (req, res) {
    date.printDate()
    date.printMonth()
    date.getBatchInfo()
    res.send('This shows date and month')
});

router.get('/test-letter', function (req, res) {
    sentence.trim()
    res.send('This changes upper to lower case and viceversa')
});

router.get('/hello', function (req, res) {
    const arrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"]
    console.log(..._.chunk(arrMonth,3))

    const arrOdd = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    console.log(_.tail(arrOdd))

    const a = [2,3,23,5,6,54,6,7]
    const b = [2,4,6,45,7]
    const c = [7,5,9]
    const d = [56,4,63,09,6]
    const e = [5,67,12,12,9,7]
    console.log(_.union(a,b,c,d,e))

    const fromPairs = ()=>{
        const obj = {
            horror:'The Shining',
            drama: 'Titanic',
            thriller: 'Shutter Island',
            fantacy: 'Pans Labyrinth'
        } 
        return obj
    }
    console.log(fromPairs())
    res.send('Multiple functions called here')
});


module.exports = router;
// adding this comment for no reason