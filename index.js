//Import the necesary librarys
import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

//Create a variable to use express for routing, the port and the api url
const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev";

//Define the public folder so app can load sources as images en styles
app.use(express.static("public"));

//Use body-parser to decode the incoming data from requests
app.use(bodyParser.urlencoded({ extended: true }));

//Use express get to load the main page content
app.get("/", async (req, res) => {
    res.render("index.ejs", {content: ""});
});

//Use express post to send the data that we want to load/filter
app.post("/get-joke", async (req, res) => {
    //Declare const for incoming user data
    const params = req.body;

    //Declare variables for the user filter choises
    let categories, type, lang;

    //If statements based in if there is an entry or not
    if(params.categories){
        if(params.categories.length > 1){
            categories = params.categories.toString();
        } else {
            categories = params.categories;
        }
    } else {
        categories = 'any';
    }
    if(params.type){
        type = params.type;
    } else {
        type = "";
    }
    if(params.lang){
        lang = params.lang;
    } else {
        lang = "";
    }

    //Error handling for the API call
    try {
        //Store the API get response in a const by axios
        const response = await axios.get(API_URL + `/joke/${categories}?lang=${lang}&type=${type}`);
        
        //Store the result JSON in result const
        const result = response.data;

        //Declare a variable for the final result
        let final;

        //IF statement based on the user response
        if(result.error){
            final = "Nothing found."
        } else if (result.joke){
            final = response.data.joke;
        } else {
            final = response.data.setup + response.data.delivery;
        }
        //Render our index page with the response pased in content
        res.render("index.ejs", {content: final});
    } catch (error) {
        //Render our index page with the response as an error
        res.status(404).send(error.message);
    }
});

//Listen to our port by express
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});