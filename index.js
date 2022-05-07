const express = require('express');
const cors = require('cors');

const bodyParser = require("body-parser");

const messagesRouter = require('./router/messagesRouter');

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/messages", messagesRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Cloud project app listenng on port ${port}!`)
});
