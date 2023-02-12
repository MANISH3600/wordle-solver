var express = require('express');
var bodyParser = require('body-parser');
const { response } = require('express');
const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('./words.db');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 9000;

let sql = `select * from "5letterwords" where `;

app.post('/wordle-recommender', function(req, res) {

    finalQuery = [];

    // add correct letters
    correct = req.body.correct;
    if (correct.length > 0) {
        correctString = [];
        correct.forEach(correctElement => {
            correctString.push(`letter${correctElement.position}="${correctElement.letter}"`);
        });
        correctQuery = correctString.join(" and ")
        finalQuery.push(correctQuery);
    }
    
    // add incorrect letters
    incorrect = req.body.incorrect;
    if (incorrect.length > 0) {
        incorrectString = "";
        incorrect.forEach(incorrectElement => {
            incorrectString += `letter${incorrectElement.position}!="${incorrectElement.letter}" and `;
        });
        incorrectString += getNotInQuery(incorrect);
        finalQuery.push(incorrectString);
    }

    // add not available letters
    notAvailable = req.body.notIn;
    if (notAvailable.length > 0) {
        finalQuery.push(`letter1 not in (${JSON.stringify(notAvailable).replace("[", "").replace("]", "")})`);
        finalQuery.push(`letter2 not in (${JSON.stringify(notAvailable).replace("[", "").replace("]", "")})`);
        finalQuery.push(`letter3 not in (${JSON.stringify(notAvailable).replace("[", "").replace("]", "")})`);
        finalQuery.push(`letter4 not in (${JSON.stringify(notAvailable).replace("[", "").replace("]", "")})`);
        finalQuery.push(`letter5 not in (${JSON.stringify(notAvailable).replace("[", "").replace("]", "")})`)
    }

    finalQueryString = sql + finalQuery.join(" and ");

    responseValue = [];

    db.all(finalQueryString, [], (err, rows) => {
        rows.forEach(row => {
            responseValue.push(getWord(row).toUpperCase());
        })
        res.send(responseValue);
    })
   
});
// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);

function getNotInQuery(incorrectPositions) {
    s = "("
    notInCondition = [];
    incorrectPositions.forEach(targetLetter => {
        notInCondition.push(GetNotInCondition(targetLetter.letter, targetLetter.position));
    });

    s += notInCondition.join(" and ")
    return s += ")";
}

function GetNotInCondition(letter, position) {
    queryParams = [];
    [1,2,3,4,5].forEach(current => {
        if (current != position) {
            queryParams.push(`letter${current}="${letter}"`)
        }
    })
    return "(" + queryParams.join(" or ") + ")";
}


function getWord(assumedWord) {
    return assumedWord['letter1'] + assumedWord['letter2'] + assumedWord['letter3'] + assumedWord['letter4'] + assumedWord['letter5'];
}
