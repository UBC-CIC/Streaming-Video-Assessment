// TODO: apparently this is how you properly use sequelize with lambda
// See: https://sequelize.org/docs/v6/other-topics/aws-lambda/

const { Sequelize } = require("sequelize");

let sequelize = null;

async function loadSequelize() {
  const sequelize = new Sequelize(
    `mysql://${process.env.DATABASE_ENDPOINT}`,
    {
      // (...)
      pool: {
        /*
         * Lambda functions process one request at a time but your code may issue multiple queries
         * concurrently. Be wary that `sequelize` has methods that issue 2 queries concurrently
         * (e.g. `Model.findAndCountAll()`). Using a value higher than 1 allows concurrent queries to
         * be executed in parallel rather than serialized. Careful with executing too many queries in
         * parallel per Lambda function execution since that can bring down your database with an
         * excessive number of connections.
         *
         * Ideally you want to choose a `max` number where this holds true:
         * max * EXPECTED_MAX_CONCURRENT_LAMBDA_INVOCATIONS < MAX_ALLOWED_DATABASE_CONNECTIONS * 0.8
         */
        max: 2,
        /*
         * Set this value to 0 so connection pool eviction logic eventually cleans up all connections
         * in the event of a Lambda function timeout.
         */
        min: 0,
        /*
         * Set this value to 0 so connections are eligible for cleanup immediately after they're
         * returned to the pool.
         */
        idle: 0,
        // Choose a small enough value that fails fast if a connection takes too long to be established.
        acquire: 3000,
        /*
         * Ensures the connection pool attempts to be cleaned up automatically on the next Lambda
         * function invocation, if the previous invocation timed out.
         */
        evict: CURRENT_LAMBDA_FUNCTION_TIMEOUT,
      },
    },
  );

  // or `sequelize.sync()`
  await sequelize.authenticate();

  return sequelize;
}

module.exports.handler = async function (event, callback) {
  // re-use the sequelize instance across invocations to improve performance
  if (!sequelize) {
    sequelize = await loadSequelize();
  } else {
    // restart connection pool to ensure connections are not re-used across invocations
    sequelize.connectionManager.initPools();

    // restore `getConnection()` if it has been overwritten by `close()`
    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
      delete sequelize.connectionManager.getConnection;
    }
  }

  try {
    return await doSomethingWithSequelize(sequelize);
  } finally {
    // close any opened connections during the invocation
    // this will wait for any in-progress queries to finish before closing the connections
    await sequelize.connectionManager.close();
  }
};
