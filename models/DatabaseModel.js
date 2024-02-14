// DatabaseModel.js
import pkg from "pg";
const { Client } = pkg;

const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "customdb",
  password: "user1234",
  port: 5432,
};

const dbClient = new Client(dbConfig);
dbClient
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Terminate the application on connection failure
  });

async function executeSqlQuery(sqlQuery, values) {
  try {
    const queryResult = await dbClient.query(sqlQuery, values);
    return queryResult.rows || [];
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  }
}

async function generateBarGraph(analyticsQuestion, sqlQuery) {
  try {
    const result = await dbClient.query(sqlQuery);

    // Assuming data is in the format provided in the example
    const labels = result.rows.map(row => Object.keys(row)[0]);
    const values = result.rows.map(row => parseInt(Object.values(row)[0]));

    const barGraphCode = `type: 'bar',
      data: {
        labels: ${JSON.stringify(labels)},
        datasets: [{
          label: 'data-1',
          data: ${JSON.stringify(values)},
          backgroundColor: "rgba(255,0,0,1)"
        }]`;

    return barGraphCode;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to generate bar graph code");
  }
}

async function closeDbConnection() {
  await dbClient.end();
}
export { executeSqlQuery, closeDbConnection, generateBarGraph };
