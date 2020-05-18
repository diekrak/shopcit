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
    user: 'orders',
    password: 'asdf1234',
    database: 'orders'
});
var cart = [];
var theuser = null;
var theuserid = null;


app.post("/order/do", function (req, res, next) {

    var body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var obj = JSON.parse(body);
        console.log(JSON.stringify(obj, null, 2));

        var ret = {
            error: 0,
            message: "success"
        };

        var query = "INSERT INTO Orders (customerID, saledate) " +
            "VALUES (?, ?)";
        var d = new Date();
        var data = [obj.cId, "" + d];

        db.query(
            query,
            data,
            function (err, result) {
                if (err) {
                    console.log("error in insert");
                    ret.message = "error in database";
                    res.end(JSON.stringify(ret));
                    throw err;
                }
                theuser = obj.name;
                console.log("orders added");
                var index = 0;
                data = [];
                var items = JSON.parse(obj.items);
                query = "INSERT INTO OrderDetails (orderID, productID, quantity, price)" +
                    " VALUES ";
                for (let index = 0; index < JSON.parse(obj.items).length; index++) {
                    if (index != 0)
                        query += ',';
                    query += " (?,?,?,?)";
                    data.push(result.insertId);
                    data.push(items[index].productID);
                    data.push(items[index].quantity);
                    data.push(items[index].price);
                }

                console.log(data);
                console.log(query);
                db.query(
                    query,
                    data,
                    function (err, result) {
                        if (err) {
                            res.end("error");
                            throw err;
                        }
                        console.log("order details added");
                        ret.message = "order added";
                        ret.error = 0;
                        res.end("order added");//JSON.stringify(ret));

                    }
                );
            }
        );
    });
});


app.get("/orders/:custId", function (req, res, next) {
    var custId = req.params.custId;
    if (custId == "undefined") {
        return;
    }
    console.log("get orders " + custId);

    var query = "select o.orderID,o.customerID,o.saledate, count(quantity) as items, sum(price) total " +
        " FROM Orders as o inner join OrderDetails as d ON o.customerID= " + custId + " AND  o.orderID=d.orderID group by o.orderID,o.customerID,o.saledate ";
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    });

    db.query(
        query,
        [],
        function (err, rows) {
            if (err) throw err;
            //     console.log(JSON.stringify(rows, null, 2));
            res.end(JSON.stringify(rows));
            console.log("ORDERS sent");
        }
    );
});


var server = app.listen(process.env.PORT || 3006, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});


