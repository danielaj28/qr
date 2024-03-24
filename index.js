var express = require("express");
var cors = require("cors");
var QRCode = require("qrcode");
var app = express();

app.use(cors());

app.get("/", async (req, res, next) => {
  res.sendFile("/src/index.html", { root: __dirname });
});

app.get("/v1/", async (req, res, next) => {
  try {
    let content = req.query.content ?? "";
    let options = {
      width: req.query.width ?? 100,
      color: {
        dark: req.query.dark ?? "000",
        light: req.query.light ?? "fff",
      },
    };
    let type = req.query.type ?? "html";

    if (content == "") {
      res
        .status("400")
        .send("Request requires content use /v1/?content=your text here");
      return;
    }

    if (options.width < 10 || options.width > 1000) {
      res
        .status("400")
        .send("Width needs to be between 10 and 1000, just as number");
      return;
    }

    if (options.dark == "" || options.light == "") {
      res
        .status("400")
        .send(
          "dark and light colours must be provided as hex strings e.g. aabbcc"
        );
      return;
    }

    console.log(`Generating qr code for ${content}`);

    QRCode.toDataURL(content, options, function (err, url) {
      switch (type) {
        case "html":
          res.send(
            `<img src="${url}" width=${options.width} height=${options.width} />`
          );
          return;
        case "png":
          res.send(url);
          return;

        default:
          res.status("400").send("The type can only be html,png,svg");
          return;
      }
    });
  } catch (err) {
    console.error("Failed to return content", err);
    res.sendStatus("500");
  }
});

app.listen(80, function () {
  console.log("Web server is listening on port 80");
});
