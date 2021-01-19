require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const pino = require('express-pino-logger')();
const cors = require('cors');

const config = require('./config');
const { videoToken } = require('./tokens');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(cors());

const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt(),
    })
  );
};

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/video/token', (req, res) => {
  const { identity } = req.query;
  const { room } = req.query;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});
app.post('/video/token', (req, res) => {
  const { identity } = req.body;
  const { room } = req.body;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.listen(process.env.PORT || 3000, () =>
  console.log('Express server is running on localhost:3001')
);
