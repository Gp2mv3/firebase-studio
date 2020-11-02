var express = require("express");
var router = express.Router();

router.get("/", async function (req, res) {
  res.send('This is a <a href="https://github.com/Gp2mv3/firebase-studio">Firebase Studio</a> proxy. Use the Firebase Studio client to connect.');
});

module.exports = router;
