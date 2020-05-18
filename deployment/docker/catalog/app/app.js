const express = require("express");
var
    epimetheus = require("epimetheus"),
    app = express();

epimetheus.instrument(app);

var http = require('http'),
    fs = require('fs'),
    url = require('url');
var p = require('path');
var qs = require('querystring');
var mysql = require('mysql');
var root = __dirname;
var headers = [
    "Product Name", "Price", "Picture", "Buy Button"
];

host_mysql = process.env.mysql_host || 'localhost';
var db = mysql.createConnection({
    host: host_mysql,
    port: '3306',
    user: 'shop',
    password: 'asdf1234',
    database: 'shop'
});
var cart = [];
var theuser = null;
var theuserid = null;


app.get('/metrics', (req, res) => {
    res.get('http://127.0.0.1:9992/metrics');
})

app.post("/newProduct", function (req, res, next) {

    var body = '';
    console.log("newProduct ");

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var product = JSON.parse(body);
        console.log(product);

        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*'
        });

        var query = "SELECT * FROM products where name = '" + product.name + "'";

        db.query(
            query,
            [],
            function (err, rows) {
                if (err) throw err;
                if (rows != null && rows.length > 0) {
                    console.log(" Product exits");
                    res.end('{"success": "0"}');
                } else {
                    query = "INSERT INTO products (name, quantity, price, image)" +
                        "VALUES(?, ?, ?, ?)";
                    db.query(
                        query,
                        [product.name, product.quantity, product.price, product.image],
                        function (err, result) {
                            if (err) {
                                response.end('{"success": "3"}');
                                throw err;
                            }
                            res.end('{"success": "1"}');

                        }
                    );
                }

            }
        );

    });


});

app.get("/getProducts", function (req, res, next) {

    console.log("getProducts");
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
    });
    var query = "SELECT * FROM products ";
    db.query(
        query,
        [],
        function (err, rows) {
            if (err) throw err;
            //     console.log(JSON.stringify(rows, null, 2));
            res.end(JSON.stringify(rows));
            console.log("Products sent");
        }
    );

});

app.get("/getProduct", function (req, res, next) {

    console.log("getProduct");
    var body = "";
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var product = JSON.parse(body);
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        });
        console.log(JSON.stringify(product, null, 2));
        var query = "SELECT * FROM products where productID=" +
            product.id;

        db.query(
            query,
            [],
            function (err, rows) {
                if (err) throw err;
                console.log(JSON.stringify(rows, null, 2));
                res.end(JSON.stringify(rows[0]));
                console.log("Products sent");
            }
        );
    });

});


var server = app.listen(process.env.PORT || 3002, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});
