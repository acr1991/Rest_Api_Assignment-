const express = require("express");
const bodyparser = require("body-parser");
const middleware = require("./middleware");

const app = express();
port = 3000;
app.listen(port, () => console.log(`${port}`));

const bodyparserMiddleware = bodyparser();
app.use(middleware);
app.use(bodyparserMiddleware);

app.post("/messages", (req, res) => {
  if (!req.body.text) {
    res.status(400).send();
  } else {
    console.log(req.body.text);
    res.send({
      message: "This is the message that was sent"
    });
  }
});
