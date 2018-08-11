require("dotenv").config();
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userCommand = process.argv[2]
var fullTitle = "";
function logData(data) {
    fs.appendFile("log.txt", data + "\r\n", function (err) {
        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }
    });
}
logData("~~~~~~~~~~~~NEW COMMAND~~~~~~~~~~~~");
if (userCommand === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        logData("Command: " + userCommand + "\r\n" + "Text File Content: " + dataArr[0] + " " + dataArr[1]);
        userCommand = dataArr[0];
        fullTitle = dataArr[1].replace(/\"/g, '');
        if (userCommand === "spotify-this-song") {
            getSongInfo();
        }
        else if (userCommand === "my-tweets") {
            getTweets();
        }
        else if (userCommand === "movie-this") {
            //We must concatenate the full title with a plus sign to pass into the query URL for the OMDB API.
            fullTitle.replace(/ /g, '+');
            getMovieInfo();
        }
        else {
            console.log("Please ensure the command and title are listed in the proper format.");
            logData("Invalid text format in file.");
        }
    });
}

function getTweets() {
    client.get('search/tweets', { q: 'from:@parallaxobject', count: 20 }, function (error, tweets, response) {
        logData("Command: " + userCommand + "\r\n" + "************OUTPUT************");
        if (error) {
            var errorMessage = "Error occurred: " + error;
            logData(errorMessage);
            console.log(errorMessage);
            return;
        }
        for (i = 0; i < 20; i++) {
            var tweetCount = i + 1;
            var linebreak = "----------TWEET #" + tweetCount + "----------";
            console.log(linebreak);
            var tweetText = tweets.statuses[i].text;
            console.log(tweetText);
            logData(linebreak + "\r\n" + tweetText);
        }
    });
}

function getSongInfo() {
    logData("Command: " + userCommand + " " + fullTitle + "\r\n" + "************OUTPUT************");
    if (fullTitle === "") {
        fullTitle = "Ace of Base The Sign";
    }
    spotify.search({ type: 'track', query: fullTitle }, function (err, data) {
        if (err) {
            var errMessage = "Error occurred: " + err;
            logData(errMessage);
            console.log("Error occurred: " + err);
            return;
        }
        else if (data.tracks.items.length === 0) {
            var noResultMessage = "Sorry, no songs matched the search terms you provided.";
            logData(noResultMessage);
            console.log("Sorry, no songs matched the search terms you provided.");
        }
        else {
            var sLineBreak = "---------SONG INFO---------";
            console.log(sLineBreak);
            var artist = "Artist(s): " + data.tracks.items[0].artists[0].name;
            console.log(artist);
            var songName = "Song Name: " + data.tracks.items[0].name;
            logData(sLineBreak + "\r\n" + artist + "\r\n" + songName);
            console.log(songName);
            if (data.tracks.items[0].preview_url === null) {
                var previewMessage = "Preview Link: No preview is available for this song";
                logData(previewMessage);
                console.log(previewMessage);
            }
            else {
                var previewLink = "Preview Link: " + data.tracks.items[0].preview_url;
                logData(previewLink);
                console.log(previewLink);
            }
            var albumInfo = "Album: " + data.tracks.items[0].album.name;
            logData(albumInfo);
            console.log(albumInfo);
        }
    });
}

function getMovieInfo() {
    logData("Command: " + userCommand + " " + fullTitle);
    logData("************OUTPUT************");
    request("http://www.omdbapi.com/?t=" + fullTitle + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        var responseStatus = (JSON.parse(body).Response);
        if (error) {
            var err0rMessage = "Error occurred: " + error;
            logData(err0rMessage);
            console.log(err0rMessage);
            return;
        }
        if (responseStatus === "False") {
            logData("Film not found.");
            console.log("Sorry, your movie was not found. Please check that the title is spelled correctly and try again.");
        }
        // If the request is successful (i.e. if the response status code is 200)
        else if (!error && response.statusCode === 200) {
            var mLineBreak = "---------MOVIE INFO---------";
            console.log(mLineBreak);
            var mTitle = "Title: " + JSON.parse(body).Title;
            console.log(mTitle);
            var mYear = "Year Released: " + JSON.parse(body).Year;
            console.log(mYear);
            var iRating = "IMDB Rating: " + JSON.parse(body).Ratings[0].Value;
            console.log(iRating);
            var rRating = "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
            console.log(rRating);
            var mCountry = "Country: " + JSON.parse(body).Country;
            console.log(mCountry);
            var mLanguage = "Language: " + JSON.parse(body).Language;
            console.log(mLanguage);
            var mPlot = "Plot: " + JSON.parse(body).Plot;
            console.log(mPlot);
            var mActors = "Actors: " + JSON.parse(body).Actors;
            console.log(mActors);
            logData(mLineBreak + "\r\n" + mTitle + "\r\n" + mYear + "\r\n" + iRating + "\r\n" + rRating + "\r\n" + mCountry + "\r\n" + mLanguage + "\r\n" + mPlot + "\r\n" + mActors)
        }
    });
}
function runCommand() {
    //The runCommand function determines which command has been called in the command line and calls the appropriate function.
    //The code below concatenates the input that is provided after the command to pass into the APIs.
    if (process.argv.length > 3) {
        var words = [];
        for (i = 3; i < process.argv.length; i++) {
            words.push(process.argv[i]);
            fullTitle = words.join("+");
        }
    }
    else {
        fullTitle = process.argv[3];
    }
    if (userCommand === "my-tweets") {
        getTweets();
    }
    else if (userCommand === "spotify-this-song") {
        getSongInfo();
    }
    else if (userCommand === "movie-this") {
        if (process.argv.length === 3) {
            fullTitle = "Mr+Nobody";
        }
        else {
            fullTitle.replace(/\"/g, '');
            fullTitle.replace(/\'/g, '');
        }
        getMovieInfo();
    }
}
runCommand();
//This searches the array of defined commands and determines whether the user's input is valid.
var definedCommands = ["do-what-it-says", "spotify-this-song", "my-tweets", "movie-this"]
if (definedCommands.indexOf(userCommand) === -1) {
    logData("Invalid command.");
    console.log("Please enter a valid command.");
}