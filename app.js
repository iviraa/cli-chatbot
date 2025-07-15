const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const { saveLogs, getLogs, clearLogs } = require("./messageLoader");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));


app.post("/chat", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (message.trim().toLowerCase() === "/clear") {
    clearLogs();
    return res.json({ response: "Chat history cleared." });
  }

  try {
    const logs = getLogs();

    const context = logs.flatMap((entry) => [
      { role: "user", content: entry.user },
      { role: "assistant", content: entry.bot },
    ]);

    console.log(context);

    context.push({
      role: "user",
      content: message,
    });

    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "moonshotai/Kimi-K2-Instruct",
        messages: context,                    
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHERAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    

    const botMessage = response.data.choices[0].message.content;

    saveLogs(message, botMessage);

    res.json({ response: botMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
