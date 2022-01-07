const process = require('process');
const express = require('express');

const app = express();
const port = 80;
const wrap = (fn) => (...args) => fn(...args).catch(args[2]);

app.get('/', wrap(async (req, res) => {
  res.send(
    `MY_PARAM_1: ${process.env.MY_PARAM_1}\n` +
    `MY_PARAM_2: ${process.env.MY_PARAM_2}`
  );
}));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
process.on('SIGINT', () => {
  process.exit(0);
});