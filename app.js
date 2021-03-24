const express = require('express');
const { redisWrapper } = require('./redisWrapper');
const { urlencoded, json } = require('body-parser');
const generateId = require('./lib/generate-id');

const app = express();

const appPort = 3000;

app.use(express.static('static'));
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.set('view engine', 'jade');
app.set('port', process.env.PORT || appPort);

//---> Setting app variable
app.locals.title = 'Pizza Express';
app.locals.pizzas = {};

app.get('/', (request, response) => {
  //--> fill up pizzas object with data from Redis
  redisWrapper.client.hgetall('pizzas', (err, values) => {
    if (!err) {
      if (values) {
        Object.keys(values).forEach((id) => {
          app.locals.pizzas[id] = JSON.parse(values[id]);
        });
      }
    }
    response.render('index');
  });
});

app.post('/pizzas', (request, response) => {
  const { pizza } = request.body;
  if (!pizza) {
    return response.sendStatus(400);
  }
  console.log(`[INFO] Cooking the pizza for you!!`);
  const id = generateId();
  const myPizza = pizza;
  myPizza.id = id;
  //---> Save to Redis
  redisWrapper.client.hset('pizzas', id, JSON.stringify(myPizza));
  // app.locals.pizzas[id] = pizza;
  response.redirect('/pizzas/' + id);
});

app.get('/pizzas/:id', (request, response) => {
  const { id } = request.params;
  let pizza;
  //---> Fetch all from Redis
  redisWrapper.client.hgetall('pizzas', (err, values) => {
    Object.keys(values).find((pizzaId) => {
      if (pizzaId === id) {
        pizza = JSON.parse(values[pizzaId]);
      }
    });
    if (!pizza) {
      response.status(400).send({
        error: 'Bad Request',
      });
    } else {
      console.log(`[INFO] pizza: ${JSON.stringify({ pizza: pizza }, null, 2)}`);
      response.render('pizza', { pizza: pizza });
    }
  });
});

module.exports = { app };
