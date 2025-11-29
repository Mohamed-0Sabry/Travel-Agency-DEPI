app.use("/api/landing", require("./routes/landing"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/destinations", require("./routes/destinations"));

module.exports = app;