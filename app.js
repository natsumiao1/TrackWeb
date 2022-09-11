const express = require("express")
const app = express()
app.use(express.static("static"))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var server = app.listen(5000, function () {
    console.log('Listening on port %d', server.address().port);
});

const datasetPath = 'dataset/Geolife Trajectories 1.3/Data/001/Trajectory/'
const resultsPath = 'results/result.json'
const load = require('./utils/load.js')

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/" + "index.html")
})

app.get('/contrast', function (req, res) {
    res.sendFile(__dirname + "/views/" + "contrast.html")
})

app.post('/mark/point', function (req, res) {
    var data = load.getData(resultsPath)
    var index = req.body.index
    var response = {}

    if (data[index].type != 'none') {
        response.code = 201
        response.msg = 'warning: type of point(' + index.toString() + ') from ' + data[index].type + ' to ' + req.body.type
    } else if (req.body.type == 'none') {
        response.code = 201
        response.msg = "warning: you don't mark the point(" + index.toString() + ')'
    } else {
        response.code = 200
        response.msg = 'success: updata point(' + index.toString() + ') to ' + req.body.type
    }

    data[index].type = req.body.type
    load.setData(data, resultsPath)

    res.send(response)
})

app.get('/data', function (req, res) {
    res.send(load.getData(resultsPath))
})

app.post('/data', function (req, res) {
    data = load.loadRaw(datasetPath, req.body.step)
    res.send(data)
})