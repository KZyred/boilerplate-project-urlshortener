require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
const URL = require("url").URL;
const bodyParser = require("body-parser");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
    res.json({ greeting: "hello API" });
});
// 1. Cần ghi lại địa chỉ để chuyển sang (addresses)
// 2. short_url: ý tưởng là random
// 3. xác minh URL đã gửi chính xác hay ko

var urlList = {};

app.post("/api/shorturl", function (req, res) {
    // var original_url = req.body.url;
    // if (original_url === "http://www.example.com") {
    //     res.json({ error: "invalid url" });
    // } else {
    //     try {
    //         const urlObject = new URL(original_url);
    //         // tạo + add list : num:url
    //         var shortenedURL = Math.floor(Math.random() * 100000).toString();
    //         urlList[`${shortenedURL}`] = original_url;
    //         res.json({ original_url: original_url, short_url: shortenedURL });
    //     } catch (e) {
    //         if (e.name === "TypeError") {
    //             res.json({ error: "invalid url" });
    //         }
    //     }
    // }
    // // {
    // //   "original_url": "https://forum.freecodecamp.org",
    // //   "short_url": 231
    // // }

    //Create variable needs
    let input = "",
        domain = "",
        param = "",
        short = 0;

    //Post url from user input
    input = req.body.url;
    if (input === null || input === "") {
        return res.json({ error: "invalid url" });
    }

    //matches a string with regular expr => return array
    //url should contains : http:// or https://
    domain = input.match(
        /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gim
    );
    //search a string with regular expr, and replace the string -> delete https://
    param = domain[0].replace(/^https?:\/\//i, "");

    //Validate the url
    dns.lookup(param, (err, url_Ip) => {
        if (err) {
            //If url is not valid -> respond error
            console.log(url_Ip);
            return res.json({ error: "invalid url" });
        } else {
            //If url is valid -> generate short url

            // short = gen_shorturl();
            // dict = { original_url: input, short_url: short };
            // dataManagement("save data", dict);
            // return res.json(dict);

            var shortenedURL = Math.floor(Math.random() * 100000).toString();
            urlList[`${shortenedURL}`] = input;
            return res.json({
                original_url: input,
                short_url: shortenedURL,
            });
        }
    });
});
app.get("/api/shorturl/:short_url", function (req, res) {
    if (urlList[req.params.short_url] !== undefined) {
        res.redirect(urlList[req.params.short_url]); //ra cái đó
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
