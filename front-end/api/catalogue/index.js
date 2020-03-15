(function () {
    'use strict';

    var bodyParser = require("body-parser");
    var express = require("express")
        , request = require("request")
        , endpoints = require("../endpoints")
        , helpers = require("../../helpers")
        , app = express()
    app.use(bodyParser.urlencoded({extended: false}));

    app.use(bodyParser.json());
    var formidable = require('formidable');

    app.post('/upload-newProduct', function (req, res) {

        var form = new formidable.IncomingForm(); //Receive form

        form.parse(req);
        let jsonData = {};

        form.on('fileBegin', function (name, file) {
            file.path = __dirname + '/../../public/images/' + file.name;
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + name + " " + file.name);
            jsonData[name] = file.name;
        });

        form.on('field', (name, field) => {
            console.log('Field', name, field)
            jsonData[name] = field;
        })

        form.on('end', () => {
            console.log("Post Data " + jsonData)

            var options = {
                uri: endpoints.newProductUrl,
                method: 'POST',
                json: true,
                body: jsonData
            };
            request(options, function (error, response, body) {

                if (error) {
                    return;
                }
                helpers.respondSuccessBody(res, JSON.stringify(body));
            }.bind({
                res: res
            }));

        });

    });


    app.get("/catalogue/images*", function (req, res, next) {
        var url = endpoints.catalogueUrl + req.url.toString();
        //  console.log("images url " + url);
        request.get(url)
            .on('error', function (e) {
                next(e);
            })
            .pipe(res);
    });

    app.get("/getProducts", function (req, res, next) {
        var x = endpoints.catalogueUrl + "/getProducts";//+ req.url.toString();
        console.log("getProducts " + x);
        helpers.simpleHttpRequest(x
            , res, next);
    });

    app.post("/newProduct", function (req, res, next) {

        var options = {
            uri: endpoints.newProductUrl,
            method: 'POST',
            json: true,
            body: req.body
        };

        request(options, function (error, response, body) {

            if (error) {
                return next(error);
            }
            helpers.respondSuccessBody(res, JSON.stringify(body));
        }.bind({
            res: res
        }));


    });


    app.get("/tags", function (req, res, next) {
        helpers.simpleHttpRequest(endpoints.tagsUrl, res, next);
    });

    module.exports = app;
}());
