const process = require('process');
const express = require('express');
const axios = require('axios');

const app = express();
const port = 80;
const wrap = (fn) => (...args) => fn(...args).catch(args[2]);

app.get('/', wrap(async (req, res) => {
  res.send('HELLO WORLD!!');
}));
app.get('/request', wrap(async (req, res) => {
  const resA = await axios.get('http://myservice-a.ecs_service_discovery.local/message');
  const resB = await axios.get('http://myservice-b.ecs_service_discovery.local/message');
  res.json({
    serviceA: resA.data.message,
    serviceB: resB.data.message,
  });
}));
app.get('/message', wrap(async (req, res) => {
  res.json({ message: `THIS IS ${process.env.SERVICE_NAME}!!` });
}));
app.use((err, req, res, next) => {
  if (err) {
    res.status(500);
    res.send(err.toString());
  } else {
    res.send('OK');
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
process.on('SIGINT', () => {
  process.exit(0);
});