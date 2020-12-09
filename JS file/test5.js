const express = require('express')
const app = express();
const port = 4000
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'Wizard';
const client = new MongoClient('mongodb://localhost:27017');
const bodyParser = require("body-parser");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));



//หน้าHome ไฟล์ index.ejs
app.get("/", function (req, res) {
    res.render("index");
})

//หน้ากรอกฟอร์มเพิ่มข้อมมูล ไฟล์ insertform2.ejs
app.get("/insert", function (req, res) {
    res.render("insertform2");
})

//กดsubmitจากหน้า /insert แล้วมาหน้านี้ แสดงข้อความว่าข้อมูลถูกเพิ่มแล้ว
app.get("/formInsert", function (req, res) {
    var data = {
        'code': req.body.code,
        'Tag': req.body.Tag
    };
    const db = client.db(dbName);
    const collection = db.collection('Wizard');
    collection.insertOne(data, function (err, result) {
        assert.equal(err, null);
        res.send("complete");
    });
})

//หน้า query ข้อมูล ไฟล์ query.ejs
app.get("/query", function (req, res) {
    res.render("query");
})

//หน้าแสดงข้อมูลที่ query จากหน้า /query
app.post('/formsave', (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('Wizard');
    // Find some documents
    collection.find({ $and: [{ 'name': req.body.name }, { 'school': req.body.school }] }).sort({ 'name': -1 }).toArray(function (err, myList) {
        assert.equal(err, null);
        res.render('showdata', { 'names': myList })
    });
})

//หน้าลบ doc เอาค่าจากไฟล์ delate.ejs
app.get('/deleteforms', function (req, res){
    res.render("delate");
})

//หน้าแสดงว่าข้อมูลถูกลบแล้ว ยังมีแก้อีกหน่อย
app.post('/deleteform', (req,res) => {
    var data = {
        "Airline" : req.body.name,
        "Flight" : req.body.fno
    }
    const db = client.db(dbName);
    const collection = db.collection('Wizard');
    collection.deleteOne(data, function(err, result){
        assert.equal(err, null);
        res.render('showdelete', { "data" : data })
    })
})


client.connect(function (err) {
    assert.strictEqual(null, err);
    console.log("Connected successfully to server");
    app.listen(port, () => console.log('listening on port ' + port))
});
