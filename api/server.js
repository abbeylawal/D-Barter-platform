const app = require("./app");

// console.log(app.get("env"));
// console.log(process.env);

const port = 3000;
const host = "127.0.0.1"; // specify your custom host
app.listen(port, host, () => {
  console.log(`App running on http://${host}:${port}.....`);
});