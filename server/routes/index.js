/**

To make this work:
- you need automator and loggerpro running, with loggerpro on the right half
  and automator on the left.
- get loggerpro to start recording (make sure it's set to record forever), and hit save as,
  making sure that it writes to the filename corresponding to cmblFilePath.
- Also make sure that the column names continue to match the appropriate variables.
- run npm start
- open localhost:3000
- make sure it's showing the thing you want
- run automator and make sure that it's doing the thing you want it to do
- watch the log in either chrome debugger or terminal to ensure it's doing what you want (num increasing)

*/



var express = require('express');
var router = express.Router();
// var csv = require('csvtojson');
var convert = require('xml-js');
var fs = require('fs');

// const csvFilePath = '../Orange final presentation test.csv'


const cmblFilePath = '../asdf.cmbl';

var timeColumnName = "Time";
var noVestaColumnName = "Temperature";
var hasVestaColumnName = "Temperature 2";

const time = 'Latest: Time (s)';
const noVesta = 'Latest: No Vesta (°C)';
const hasVesta = 'Latest: Vesta (°C)';

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/data', function (req, res, next) {
    let jsonData = [];
    let timeArray = [];
    let noVestaArray = [];
    let hasVestaArray = [];

    // parse from csv, courtesy of victor. we're now directly parsing the cmbl
    // csv()
    //     .fromFile(csvFilePath)
    //     .then((jsonObj) => {
    //         for (i of jsonObj) {
    //             jsonData.push({
    //                 time: i[time],
    //                 noVesta: i[noVesta],
    //                 hasVesta: i[hasVesta]
    //             })
    //             timeArray.push(i[time])
    //             noVestaArray.push(i[noVesta])
    //             hasVestaArray.push(i[hasVesta])
    //         }
    //         // jsonData unused
    //         res.json({
    //             timeArray,
    //             noVestaArray,
    //             hasVestaArray
    //         });
    //     })
    var cmblFile = fs.readFileSync(cmblFilePath, 'utf8');
    // console.log(cmblFile);
    console.log("parsed cmbl");
    var cmblJson = convert.xml2js(cmblFile, {compact: true, spaces: 4});
    console.log("parsed json");
    var data = cmblJson['Document']['DataSet']['DataColumn'];
    console.log("got data");
    console.log(data.length);
    for (var entry in data) {
        element = data[entry];
        console.log('got a new element');
        // console.log(element);//['DataObjectName']['_text']);
        switch (element['DataObjectName']['_text']) {
            case timeColumnName:
                console.log("got time");
                timeArray = element['ColumnCells']['_text'].split('\n').slice(1,-1);
                break;
            case noVestaColumnName:
                console.log("got temp");
                noVestaArray = element['ColumnCells']['_text'].split('\n').slice(1,-1);
                break;
            case hasVestaColumnName:
                console.log("got temp2");
                hasVestaArray = element['ColumnCells']['_text'].split('\n').slice(1,-1);
                break;
            default:
                console.log("got nothing");
                break;
        }
    }

    console.log(timeArray);
    console.log(noVestaArray);
    console.log(hasVestaArray);

    res.json({
        timeArray,
        noVestaArray,
        hasVestaArray
    });

    // ['ColumnCells']['_text'].split('\n');
    // var time = cmblJson['Document']...['ColumnCells'];

    // csv()
    //     .fromFile(csvFilePath)
    //     .then((jsonObj) => {
    //         for (i of jsonObj) {
    //             jsonData.push({
    //                 time: i[time],
    //                 noVesta: i[noVesta],
    //                 hasVesta: i[hasVesta]
    //             })
    //             timeArray.push(i[time])
    //             noVestaArray.push(i[noVesta])
    //             hasVestaArray.push(i[hasVesta])
    //         }
    //         // jsonData unused
    //         res.json({
    //             timeArray,
    //             noVestaArray,
    //             hasVestaArray
    //         });
    //     })

})

module.exports = router;
