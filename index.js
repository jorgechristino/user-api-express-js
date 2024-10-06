const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const router = require("./routes/routes");
const cors = require("cors");

const host = "localhost";
const port = 3000;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
