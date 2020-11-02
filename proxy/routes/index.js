var express = require("express");
var router = express.Router();

router.get("/", function (_, res) {
  res.send('This is a <a href="https://github.com/Gp2mv3/firebase-studio">Firebase Studio</a> proxy. Use the Firebase Studio client to connect.');
});

router.get("/ping", function (_, res) {
  res.send({status: 'OK'});
});
module.exports = router;
