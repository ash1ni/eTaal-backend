import { generateBarGraph } from "../models/DatabaseModel.js";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function getBargraph(req, res) {
  const { analyticsQuestion, data } = req.body;

  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `
        You are a data vizualisation agent who when given an analytics question (natural language) and data (format: json) decides the visualisation and responds with json code of the specified visualisation. We are using charts.js as our primary library of visualisation. Here are few examples for your reference: 
  
        example 1:
        Question: What was the weekly sales of our product last week? 
        Data: [ { 'Monday': '12' }, {'Tuesday' : '19'}, {'Wednesday': '3'}, {'Thursday': '17'}, {'Friday': '28'}, {'Saturday': '24'},{'Sunday': '7'} ]
        Chart selected: Bar Chart
        Response: '''type: 'bar',
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sst", "Sun"],
            datasets: [{
              label: 'data-1',
              data: [12, 19, 3, 17, 28, 24, 7],
              backgroundColor: "rgba(255,0,0,1)"
            }'''
        
        Your response should only be the code which is mentioned in response. Please only respond in markdown format.
        
        
        Give the respond of the following query: 
        Question: "${analyticsQuestion}"
        Data: "${JSON.stringify(data)}"`,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const promptResponse = response.choices[0].text.trim();
    const barGraphCode = await generateBarGraph(analyticsQuestion, data);

    console.log(barGraphCode);
    res.json({ barGraphCode, promptResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { getBargraph };
