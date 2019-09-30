const express = require('express');
const connect = require('connect');
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "us-cdbr-iron-east-05.cleardb.net",
    user: "b118d552ca1048",
    password: "a788fabb",
    database: "heroku_986afb54c3475af",
    timezone: 'jst'
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());


/**
 * 
 * 以下Heroku用の通信制御
 * 
 */
var LostConnection;
function handleDisconnect() {
    LostConnection = mysql.createConnection(connection);
    LostConnection.connect(function(err) {
        if (err) {
          setTimeout(handleDisconnect, 1000);
        }
    });
    LostConnection.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();

/**
 * 
 * 以下クエリ
 * 
 */
app.get("/", function(req, res) {
    res.send("go to /posts to see posts");
});

app.get("/menu", function(req, res) {
    console.log("SELECT * from menu;");
    connection.query("SELECT * from menu;", function(
        error,
        results,
        fields
    ) {
        console.log(results);
        if (error) throw error;
        res.send(results);
    });
});

app.get("/history", function(req, res) {
    console.log("SELECT * from history;");
    connection.query("SELECT * from history;", function(
        error,
        results,
        fields
    ) {
        console.log(results);
        if (error) throw error;
        res.send(results);
    });
});

app.post("/edit/addMenu", function(req, res) {
    console.log('テスト中');
    console.log(req.body);
    console.log("insert menu (item_name, item_price, memo, create_date, update_date) values ('" + req.body.name + "', " + req.body.price + ", '" + req.body.memo + "', now(), now());");
    connection.query("insert menu (item_name, item_price, memo, create_date, update_date) values ('" + req.body.name + "', " + req.body.price + ", '" + req.body.memo + "', now(), now());", function(
        error,
        results,
        fields
    ) {
        console.log(results);
        if (error) throw error;
        res.send(results);
    });
});

app.post("/edit/deleteMenu", function(req, res) {
    console.log("delete from  menu where id =" + req.body.id + ";");
    connection.query("delete from  menu where id =" + req.body.id + ";", function(
        error,
        results,
        fields
    ) {
        console.log(results);
        if (error) throw error;
        res.send(results);
    });
});

app.post("/history", function(req, res) {
    console.log("insert into history (item_name, purchased_count, purchased_price, total_price, deposit_price, create_date, update_date) values (" + req.body.receipt_id + ", '" + req.body.item_name + "', " + req.body.purchased_count + ", " + req.body.purchased_price + ", " + req.body.total_price + ", " + req.body.deposit_price + ", now(), now());");
    connection.query("insert into history (receipt_id, item_name, purchased_count, purchased_price, total_price, deposit_price, create_date, update_date) values (" + req.body.receipt_id + ", '" + req.body.item_name + "', " + req.body.purchased_count + ", " + req.body.purchased_price + ", " + req.body.total_price + ", " + req.body.deposit_price + ", now(), now());", function(
        error,
        results,
        fields
    ) {
        console.log(results);
        if (error) throw error;
        res.send(results);
    });
});

app.post("/history/delete", function(req, res) {
    console.log("delete from history where receipt_id = " + req.body.receipt_id + ";");
    connection.query("delete from history where receipt_id = " + req.body.receipt_id + ";", function(
        error,
        results,
        fields
    ) {
        console.log(results);
        if (error) throw error;
        res.send(results);
    });
});

var port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("App is running on port " + port);
});
