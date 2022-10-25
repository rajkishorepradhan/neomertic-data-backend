const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const inference_result = require("./controller/inference_controller")
require("./config/mongoose").init();

// Api End Points
app.use("/data",inference_result )

const port= 8080;

app.listen(port,() => console.log(`neometry data backend listening on port ${port}!`));
