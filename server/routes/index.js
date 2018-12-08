var express = require('express');
var router = express.Router();
var csv = require('csvtojson')

const csvFilePath = '../Orange final presentation test.csv'

const time = 'Latest: Time (s)';
const noVesta = 'Latest: No Vesta (°C)';
const hasVesta = 'Latest: Vesta (°C)';

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/data', function (req, res, next) {
    let jsonData = []
    let timeArray = [];
    let noVestaArray = [];
    let hasVestaArray = [];
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            for (i of jsonObj) {
                jsonData.push({
                    time: i[time],
                    noVesta: i[noVesta],
                    hasVesta: i[hasVesta]
                })
                timeArray.push(i[time])
                noVestaArray.push(i[noVesta])
                hasVestaArray.push(i[hasVesta])
            }
            // jsonData unused
            res.json({
                timeArray,
                noVestaArray,
                hasVestaArray
            });
        })

})

module.exports = router;
