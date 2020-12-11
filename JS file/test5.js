const express = require('express')
const app = express();
const port = 3000
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'demo';
const client = new MongoClient('mongodb://localhost:27017');
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

//หน้าHome ไฟล์ index.ejs
app.get("/", function (req, res) {
    res.render("index");
})

//หน้ากรอกฟอร์มเพิ่มข้อมมูล ไฟล์ insertform2.ejs
app.get("/insert", function (req, res) {
    res.render("insertform");
})

//หน้าแสดงข้อมูลที่ insert
app.post("/formInsert", function (req, res) {
    var data = {
        "NameAirline": req.body.airline,
        "FlightNo": req.body.flightNo,
        "Type": req.body.type,
        "Class": [
            {
                "FirstClass": {
                    "Price": req.body.price1,
                    "NumberOfPassengers": req.body.passenger1
                },
                "BusinessClass": {
                    "Price": req.body.price2,
                    "NumberOfPassengers": req.body.price2
                },
                "Economy": {
                    "Price": req.body.price3,
                    "NumberOfPassengers": req.body.passenger3
                }
            }
        ],
        "Source": req.body.source,
        "AirportSource": req.body.Airsource,
        "Destination": req.body.dest,
        "AirportDestination": req.body.Airdest,
        "DateDetail": [
            {
                "DateStart": {
                    "Date": req.body.date,
                    "DepartureTime": req.body.Boarding,
                    "ArrivingTime": req.body.Arriving
                }
            },
            {
                "DateEnd": {
                    "Date": req.body.enddate,
                    "DepartureTime": req.body.endBoarding,
                    "ArrivingTime": req.body.endArriving
                }
            }
        ],
        "CaptionName": req.body.captain,
        "CoPilotName": req.body.captain2,
        "Numberof_FlightAttendant": req.body.attandant
    };
    const db = client.db(dbName);
    const collection = db.collection('demo');
    collection.insertOne(data, function (err, result) {
        assert.equal(err, null);
        res.render("viewInsert", { 'data': data });
    });
})

app.get("/query", function (req, res) {
    res.render("query");
})

//หน้าแสดงข้อมูลที่ query จากหน้า /query
app.post('/formsave', (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('demo');
    // Find some documents
    collection.find({ $and: [{ 'NameAirline': req.body.airline }, { 'Type': req.body.type }] }).sort({ 'airline': -1 }).toArray(function (err, myList) {
        assert.equal(err, null);
        res.render('viewquery', { 'data': myList })
    });
})

//หน้าแสดงข้อมูลทั้งหมด
app.get("/queryall", function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('demo');
    // Find some documents
    collection.find({}).toArray(function (err, myList) {
        assert.equal(err, null);
        res.render('all', { 'data': myList })
    });

})

//หน้าลบข้อมูล
app.get('/deleteforms', function (req, res) {
    res.render("delete");
})

//หน้าแสดงว่าข้อมูลถูกลบแล้ว
app.post('/deleteform', (req, res) => {
    var data = {
        "NameAirline": req.body.name,
        "FlightNo": req.body.fno
    };
    const db = client.db(dbName);
    const collection = db.collection('demo');
    collection.deleteOne(data, function (err, result) {
        assert.equal(err, null);
        res.render('viewลบ', { "data": data })
    })
})

client.connect(function (err) {
    assert.strictEqual(null, err);
    console.log("Connected successfully to server");
    app.listen(port, () => console.log('listening on port ' + port))
});
