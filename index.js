import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs", {content: ""});
});

app.post("/get-joke", async (req, res) => {
    const paramss = req.body;
    let categories, type, lang;
    if(req.body.categories){
        if(req.body.categories.length > 1){
            categories = req.body.categories.toString();
        } else {
            categories = req.body.categories;
        }
    } else {
        categories = 'any';
    }
    if(req.body.type){
        type = req.body.type;
    } else {
        type = "";
    }
    if(req.body.lang){
        lang = req.body.lang;
    } else {
        lang = "";
    }

    if(req.body.type)
    console.log(paramss);

    console.log(categories);
    try {
        console.log(API_URL + `/joke/${categories}?lang=${lang}&type=${type}`);
        const response = await axios.get(API_URL + `/joke/${categories}?lang=${lang}&type=${type}`);
        const result = response.data;
        let final;
        if(result.error){
            final = "Nothing found."
        } else if (result.joke){
            final = response.data.joke;
        } else {
            final = response.data.setup + response.data.delivery;
        }
        console.log(final);
        res.render("index.ejs", {content: final});
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});