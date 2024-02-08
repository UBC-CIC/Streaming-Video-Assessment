import mysql from "mysql";

// Function to establish a MySQL connection
function connectToDatabase() {
  const connection = mysql.createConnection({});

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to database:", err);
        reject(err);
        return;
      }
      console.log("Connected to MySQL database");
      resolve(connection);
    });
  });
}

// Function to execute a query
async function queryDatabase(query, params) {
  try {
    const connection = await connectToDatabase();
    const results = await executeQuery(connection, query, params);
    connection.end(); // Close the connection
    return results;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

function executeQuery(connection, query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

export { connectToDatabase, queryDatabase };
