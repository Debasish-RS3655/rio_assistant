//this is the overall server for the project
//Debashish Buragohain

const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const agent_apikey = require("./config").agent_apikey;
const chat_apikey = require("./config").chat_apikey;

const configuration = new Configuration({
    apiKey: agent_apikey
});
const openai = new OpenAIApi(configuration);
//CORS enabling
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false); //no cookies needed
    next(); //pass to the next layer of middleware
});
app.use(bodyParser.json({ limit: '50MB' }));
app.use(function (err, req, res, next) {        //server error handler
    console.error("Backend Error: Error in backend main server: ", err.stack)
    res.status(500).send('Something broke in the backend server!')
    next();
});


let objective = "";
app.post('/get-gpt-command', async function (req, res) {
    objective = req.body.objective
    console.log("Received objective: ", req.body.objective);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.prompt,
        temperature: req.body.temperature,
        best_of: req.body.best_of,
        n: req.body.n,
        max_tokens: req.body.max_tokens,
    });
    const response = completion.data.choices[0].text;
    console.log("received response: ", response)
    res.set("Content-Type", "text/html");
    //sending a dummy response for the time being
    res.send(response);
    //res.send('TYPESUBMIT 8 "anchorage redfin"');
})

const history = []
app.post("/get-speech", async function (req, res) {
    if (objective.length !== 0) {
        let gen_speech = "";
        const messages = [];
        for (const [input_text, completion_text] of history) {
            messages.push({ role: "user", content: input_text });
            messages.push({ role: "assistant", content: completion_text });
        }
        messages.push({ role: "user", content: objective });
        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            gen_speech = completion.data.choices[0].message.content;
            history.push([objective, gen_speech]);
        }
        catch (err) {
            console.error("Error receiving a chat response: ", err.message)
        }
        res.json({ speech: gen_speech })
        objective = "";
    }
    else res.json({ speech: "" })
})

app.listen(2003, () => console.log('agent server listening to port 2003'));