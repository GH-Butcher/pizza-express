const { app } = require('./app');
const { redisWrapper } = require('./redisWrapper');

//-----------------------------------------
const start = () => {
  try {
    //----> Verify the environment variablea are defined prior to load application
    if (!process.env.REDIS_HOST) {
      throw new Error(`REDIS_HOST must be defined`);
    }
    if (!process.env.REDIS_PORT) {
      throw new Error(`REDIS_PORT must be defined`);
    }
    //--> Setup Redis Client Singleton
    redisWrapper.connect(process.env.REDIS_HOST, process.env.REDIS_PORT);
  } catch (err) {
    console.error(err);
  }

  app.listen(app.get('port'), () => {
    console.log(`[${app.locals.title}] Listening on port ${app.get('port')}!`);
    //---> Testing Redis
    redisWrapper.client.set('somekey', 'successful test');
    redisWrapper.client.get('somekey', (err, reply) => {
      // reply is null when the key is missing
      console.log(reply);
    });
  });
};

start();
