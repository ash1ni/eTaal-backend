// SqlToTextController.js
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai";
import { executeSqlQuery } from "../models/DatabaseModel.js";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function generateExplanation(tableData, naturalLanguage) {
  try {
    const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt:` "You are an analytics explainer which translates the given question and response given by SQL in JSON to that question to an explanation. Please note your answer should be to the point and should not be more than 1-2 lines.Please include data from SQL, not the exact query but just the data and form a well defined answer only giving insight and not explaining the query. Also you should explain the query response with it's respective data. Here is the given query: \n\n- Question: "${naturalLanguage}"\n- SQL response:"${tableData}" \n"`,
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

    const explanation = response.choices[0].text.trim();
    return explanation;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to generate explanation");
  }
}

async function getSqlToText(req, res) {
  const { tableData } = req.body;

  try {
    const explanation = await generateExplanation(tableData);
    console.log(explanation);
    res.json({ explanation });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { getSqlToText };
