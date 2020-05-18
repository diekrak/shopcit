var express = require("express")
    , epimetheus = require("epimetheus")
    , app = express();
var http = require('http'),
    url = require('url');
var mysql = require('mysql');

epimetheus.instrument(app);


host_mysql = process.env.mysql_host || 'localhost';

var db = mysql.createConnection({
    host: host_mysql,
    user: 'shop',
    password: 'asdf1234',
    database: 'shop'
});
var cart = [];
var theuser = null;
var theuserid = null;


app.post("/login", function (req, res, next) {

    var body = '';
    console.log("user Login ");
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var obj = JSON.parse(body);
        console.log(JSON.stringify(obj, null, 2));
        var query = "SELECT * FROM Customer where name='" + obj.name + "'";
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*'
        });

        db.query(
            query,
            [],
            function (err, rows) {
                if (err) {
                    res.end('{"error": "1"}');
                    throw err;
                }
                if (rows != null && rows.length > 0) {
                    console.log(" user in database , " + rows[0]);
                    theuserid = rows[0].customerID;
                    var obj = {
                        id: theuserid,
                        name: rows[0].name,
                        isAdmin: rows[0].isAdmin
                    }
                    res.end(JSON.stringify(obj));

                } else {
                    res.end('{"error": "1"}');
                    console.log("user not in database");
                }
            }
        );
    });
});


app.post("/register", function (req, res, next) {
    var body = '';
    console.log("user Register ");
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var obj = JSON.parse(body);
        if (obj.admin === undefined) {
            obj.admin = 0;
        }
        console.log(JSON.stringify(obj, null, 2));
        var query = "SELECT * FROM Customer where name='" + obj.name + "'";
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*'
        });

        db.query(
            query,
            [],
            function (err, rows) {
                if (err) {
                    res.end("error");
                    throw err;
                }
                if (rows != null && rows.length > 0) {
                    console.log(" user " + obj.name + " already in registered");
                    res.end('{"error": "2" , "message": "user ' + obj.name + ' already in registered" }');
                } else {
                    query = "INSERT INTO Customer (name, password, address, isAdmin)" +
                        "VALUES(?, ?, ?, ?)";
                    db.query(
                        query,
                        [obj.name, obj.password, obj.address, obj.admin],
                        function (err, result) {
                            if (err) {
                                // 2 res is an sql error
                                res.end('{"error": "3"}');
                                throw err;
                            }
                            console.log(result);
                            theuserid = result.insertId;
                            var obj = {
                                id: theuserid,
                                name: this.values[0],
                                isAdmin: this.values[3]
                            }
                            res.end(JSON.stringify(obj));

                        }
                    );
                }

            }
        );
    });
});


var server = app.listen(process.env.PORT || 3001, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});


