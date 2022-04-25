const express = require("express");
const app = express();
var path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));
const Report = require("./models/report");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

var transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "nistestOTP@outlook.com", //process.env.mailid,
    pass: process.env.pass,
  },
});

app.get("/", (req, res) => {
  res.render("form.ejs");
});

app.post("/redirect", (req, res) => {
    var type = req.body.type;

    if(type ==1)
        res.render("allreports.ejs");
    else if(type ==2)
        res.render("accinfo.ejs");
    else if(type ==3)
      res.render("acctype.ejs");
});

app.post("/fetchAcctype",(req,res)=>{
    var type = req.body.type;
    res.render("reportAcc.ejs",{accType:type});
});

app.post("/fetchAccinfo",(req,res)=>{
  var info = req.body.info;
  res.render("reportAccInfo.ejs",{accInfo:info});
});

app.get("/admin", (req, res) => {
    res.render("admin.ejs");
});

function sendEMail(acctype, accinfo, accdesc, images) {
  var data =
    "<h1>Details : </h1><br><h2>Account Type : " +
    acctype +
    "</h2><br><h2>Account Number : " +
    accinfo +
    "</h2><br><h2>Account Description : " +
    accdesc +
    "</h2>";

  var mailOptions = {
    from: "nistestOTP@outlook.com", //process.env.mailid,
    to: process.env.email,
    subject: "Details Reported",
    html: data,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent To : " + process.env.email);
    }
  });
}

app.post("/report", (req, res) => {
  const report = new Report({
    accountType: req.body.accountType,
    accountInfo: req.body.accountInfo,
    images: req.body.images,
    description: req.body.description,
  });
  report.save().then((result) => {
    sendEMail(
      req.body.accountType,
      req.body.accountInfo,
      req.body.description,
      req.body.images
    );
    res.send(result);
  });
});

app.get("/allreports", (req, res) => {
  Report.find({}, { images: 0 }).then((result) => {
    res.json(result);
  });
});

app.get("/reports/:id", (req, res) => {
  Report.find({ accountType: req.params.id }, { images: 0 }).then((result) => {
    res.json(result);
  });
});

app.get("/search", (req, res) => {
  Report.find(
    {
      accountInfo: {
        $regex: new RegExp("^" + req.query.sk.toLowerCase(), "i"),
      },
    },
    { images: 0 }
  ).then((result) => {
    res.json(result);
  });
});

module.exports = app;
