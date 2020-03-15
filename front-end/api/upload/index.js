// (function () {
//     'use strict';
//
//     const multer = require('multer');
//     const path = require('path');
//
//
//     var bodyParser = require("body-parser");
//     var express = require("express")
//         , request = require("request")
//         , endpoints = require("../endpoints")
//         , helpers = require("../../helpers")
//         , app = express()
//
//     app.use(bodyParser.urlencoded({extended: false}));
//     app.use(bodyParser.json());
//
//
//     // var express = require("express")
//     //     , request = require("request")
//     //     , helpers = require("../../helpers")
//     //     , app = express()
//
//
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             console.log( __dirname)
//             cb(null, __dirname +  '/uploads/');
//         },
//
//         // By default, multer removes file extensions so let's add them back
//         filename: function (req, file, cb) {
//             cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//         }
//     });
//
//     app.post('/upload-profile-pic', (req, res) => {
//         // 'profile_pic' is the name of our file input field in the HTML form
//         let upload = multer({storage: storage, fileFilter: helpers.imageFilter}).single('profile_pic');
//
//         upload(req, res, function (err) {
//             // req.file contains information of uploaded file
//             // req.body contains information of text fields, if there were any
//
//             if (req.fileValidationError) {
//                 return res.send(req.fileValidationError);
//             } else if (!req.file) {
//                 return res.send('Please select an image to upload');
//             } else if (err instanceof multer.MulterError) {
//                 return res.send(err);
//             } else if (err) {
//                 return res.send(err);
//             }
//
//             // Display uploaded image for user validation
//             res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="..">Upload another image</a>`);
//         });
//     });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//     app.get("/catalogue/images*", function (req, res, next) {
//         var url = endpoints.catalogueUrl + req.url.toString();
//         //  console.log("images url " + url);
//         request.get(url)
//             .on('error', function (e) {
//                 next(e);
//             })
//             .pipe(res);
//     });
//
//     app.get("/getProducts", function (req, res, next) {
//         var x = endpoints.catalogueUrl + "/getProducts";//+ req.url.toString();
//         console.log("getProducts " + x);
//         helpers.simpleHttpRequest(x
//             , res, next);
//     });
//
//     app.post("/newProduct", function (req, res, next) {
//
//         var options = {
//             uri: endpoints.newProductUrl,
//             method: 'POST',
//             json: true,
//             body: req.body
//         };
//         console.log("oanci,", JSON.stringify(req.body))
//         console.log("oanci,", req.body)
//
//
//         request(options, function (error, response, body) {
//
//             if (error) {
//                 return next(error);
//             }
//             helpers.respondSuccessBody(res, JSON.stringify(body));
//         }.bind({
//             res: res
//         }));
//
//
//     });
//
//
//     app.get("/tags", function (req, res, next) {
//         helpers.simpleHttpRequest(endpoints.tagsUrl, res, next);
//     });
//
//
//     module.exports = app;
// }());
