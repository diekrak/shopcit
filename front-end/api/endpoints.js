(function () {
    'use strict';

    var host_catalog = process.env.catalog || "localhost:3003"
    var host_cart = process.env.cart || "localhost:3004"
    var host_users = process.env.users || "localhost:3001"
    var host_orders = process.env.orders || "localhost:3006"

    module.exports = {
        catalogueUrl: "http://" + host_catalog,
        newProductUrl: "http://" + host_catalog + "/newProduct",
        tagsUrl: "http://localhost:8082/catalogue/tags",
        cartsUrl: "http://" + host_cart,
        ordersUrl: "http://" + host_orders,
        customersUrl: "http://localhost:8080/customers",
        addressUrl: "http://localhost:8080/addresses",
        cardsUrl: "http://localhost:8080/cards",
        loginUrl: "http://" + host_users + "/login",
        registerUrl: "http://" + host_users + "/register"
    };


}());
