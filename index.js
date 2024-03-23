var express = require("express");
var cors = require("cors");
var QRCode = require("qrcode");
var app = express();

app.use(cors());

app.get("/v1/", async (req, res, next) => {
  try {
    if (req.query.content == undefined || req.query.content == "") {
      res
        .status("400")
        .send("Request requires content use /v1/?content=your text here");
      return;
    }

    console.log(`Generating qr code for ${req.query.content}`);
    QRCode.toDataURL(req.query.content, function (err, url) {
      res.send(`<img src="${url}" width=200 height=200/>`);
    });
  } catch (err) {
    console.error("Failed to return content", err);
    res.sendStatus("500");
  }
});

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
