const express = require("express");
const fs = require("fs")
const morgan = require("morgan");
const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");

const app = express();
app.use(express.json()); // middleware express function
app.use(morgan("dev"));

//Custom Template
app.use(express.static(`${__dirname}/nft-data/img`));

// ============ MIDDLEWARE ================
app.use((req, res, next) => {
    console.log("Hey I am from Middleware ")
    next();
});

app.use((req, res, next) => {
    req.requestTime =   new Date().toISOString();
    next();
});

// ++++++++++++ Run APP +++++++++++++
app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);


module.exports = app;