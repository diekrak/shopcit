
var express = require("express")
    , morgan = require("morgan")
    , path = require("path")
    , epimetheus = require("epimetheus")
    , bodyParser = require("body-parser")
    , app = express();

epimetheus.instrument(app);

app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

//app.use(morgan("dev", {}));
var cart = [];


app.post("/add", function (req, res, next) {
    var obj = req.body;
    console.log("add ");
    console.log("Attempting to add to cart: " + JSON.stringify(req.body));

    var max = 0;
    var ind = 0;
    if (cart["" + obj.custId] === undefined)
        cart["" + obj.custId] = [];
    var c = cart["" + obj.custId];
    var isNew = true
    for (ind = 0; ind < c.length; ind++) {
        if (c[ind].productID == obj.productID) {
            c[ind].quantity = parseInt(c[ind].quantity) + parseInt(obj.quantity);
            isNew = false
        }
        if (max < c[ind].cartid) {
            max = c[ind].cartid;
        }
    }
    var cartid = max + 1;
    var data = {
        "cartid": cartid,
        "productID": obj.productID,
        "name": obj.name,
        "price": obj.price,
        "image": obj.image,
        "quantity": obj.quantity
    };
    console.log(JSON.stringify(data));
    if (isNew) {
        console.log("Added");
        c.push(data);
    }
    console.log(cart);
    res.status(201);

    res.send("");


});


app.del("/cart/:custId/items/:id", function (req, res, next) {
    var body = '';
    console.log("Delete item from cart: for custId " + req.url + ' ' +
        req.params.id.toString());

    let customerCart = cart["" + req.params.custId];
    customerCart = customerCart.filter(item => item.cartid != req.param.id);
    for (const item of customerCart) {
        if (item.cartid == req.params.id) {
            customerCart.splice(customerCart.indexOf(item), 1);
            cart["" + req.params.custId] = customerCart;
            break;
        }
    }
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(cart));

});


app.get("/cart/:custId/items", function (req, res, next) {
    var custId = req.params.custId;
    console.log("getCart " + custId);
    console.log('cart ' + cart);
    console.log(JSON.stringify(cart["" + custId], null, 2));
    res.send(JSON.stringify(cart["" + custId]));
    console.log("cart sent" + JSON.stringify(cart["" + custId]));
});

app.get("/cart/:custId/order/done", function (req, res, next) {
    var custId = req.params.custId;
    console.log("getCart " + custId);
    console.log('cart ' + cart);
    console.log(JSON.stringify(cart["" + custId], null, 2));
    console.log("cart sent" + JSON.stringify(cart["" + custId]));
    let body = JSON.stringify(cart["" + custId]);
    res.send(body);
    cart["" + custId] = [];
});



var server = app.listen(process.env.PORT || 3004, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"),  port);
});
