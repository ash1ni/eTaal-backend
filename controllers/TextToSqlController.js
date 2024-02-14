// TextToSqlController.js
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai";
import { executeSqlQuery } from "../models/DatabaseModel.js";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateSqlQuery(naturalLanguage) {
    try {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt:`"Generate syntactically correct read-only SQL to answer the asked question \"${naturalLanguage}"\" by the user: \n        The following are schemas of tables you can query:\n        ---------------------\n        CREATE TABLE IF NOT EXISTS ServiceTransDetails(\n    STD_ID int PRIMARY KEY,\n    STD_Date timestamp default now(),\n    Project varchar(255),\n    service varchar(255),\n    serviceTransCount int,\n    stateCode varchar(20) \n);\n        ---------------------\n\nThe information of the columns is given below: \n\nSTD_ID: Acts as a unique primary key for the table\nSTD_DATE: Holds the date of the transaction written into the database\nProject: Project has the project name for the transaction \nservice: This column holds the service name for which the transaction has ocurred \nserviceTranscount: This coulmn has the transaction number which has been written in the file \nstateCode: Holds the state value which has the state where the transaction has occurred \n\nHere are the distinct column values for Project, service and stateCode: \nProject: \"project\", \"Certificate\", \"Grievance\", \"Commercial Tax\", \"Land Revenue\", \"Transport\", \"State Specific Services\", \"Public Distribution System\", \"Health\", \"Education\"\nservice: \"service\", \"DL Registered\", \"Sale of Ration at Fair Price Shop\", \"Current Adangal / Pahani\", \"DL Issued\", \"E-cards Generation\", \"Income Certificate\", \"Transit Form\", \"Student registration for availing College Scholarships\", \"Grievance Registration on Public Grievance Portal\", \"EWAYBILL\"\nstateCode: \"CHANDIGARH\", \"HP\", \"Arunachal Pradesh\", \"MADHYAPRADESH\", \"DEL\", \"GUJARAT\", \"GOA\", \"Haryana\", \"AP\"\n\n\nHere are few examples to gain clarity over the database and questions:\n\nQuestion: What are the total transactions in for February this year?\nSELECT SUM(servicetransdetails)\nFROM ServiceTransDetails\nWHERE EXTRACT(MONTH FROM STD_Date) = 2;\n\n\nQuestion: What are the total transactions in E way bill in Delhi for February this year?\n\nSELECT SUM(servicetransdetails)\nFROM ServiceTransDetails\nWHERE EXTRACT(MONTH FROM STD_Date) = 2\nAND statecode = 'DEL'\nAND service = 'EWAYBILL';\n\nQuestion: What are the total services in the platform?\nSELECT DISTINCT(service)\nFROM public.servicetransdetails;\n\nMake sure to write your answer in markdown format and only return the SQL query which is syntactically correct based on the above information." `,
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      const sqlQuery = response.choices[0].text.trim();
      return sqlQuery;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to generate SQL query");
    }
  }
  
  async function getTextToSql(req, res) {
    const { naturalLanguage } = req.body;
  
    try {
      const sqlQuery = await generateSqlQuery(naturalLanguage);
      console.log(sqlQuery);
      const result = await executeSqlQuery(sqlQuery);
      console.log(result);
      const tableData = result.map(row=> Object.values(row));
      console.log(tableData);
      res.json({ sqlQuery, tableData });
      res.locals = { sqlQuery, tableData };
      // next();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  export { getTextToSql };
