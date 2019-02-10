require("dotenv").config();

var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");

var command = process.argv[2];
var input = process.argv.slice(3).join(" ");

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

commandSwitch(command, input);

function commandSwitch(command, input) {
    switch (command) {
        case "concert-this":
            getConcert(input);
            break;
        case "spotify-this-song":
            getSong(input);
            break;
        case "movie-this":
            getMovie(input);
            break;
        case "do-what-it-says":
            getRandom();
            break;
        default:
            console.log("Please use a valid command. concert-this, spotify-this-song-this, or do-what-it-says");
            return;
    }
};


function getConcert(input) {
    var bandsURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    request(bandsURL, function (error, response, body) {
        var output = JSON.parse(body);
        // console.log(output);

        for (var i = 0; i < output.length; i++) {

            var divider = "\n--------------------------------------------\n";

            var concertData = [
                "Artist: " + output[i].lineup,
                "Venue: " + output[i].venue.name,
                "Location: " + output[i].venue.city + ", " + output[i].venue.region,
                "Date " + moment(output[i].datetime).format("MM/DD/YYYY")
            ].join("\n\n");

            
            fs.appendFile("log.txt", divider + concertData + divider, function (error) {
                if (error) throw error;
                console.log(divider + concertData + divider);
            });

        }
    })
};

function getSong(input) {
    var song = input;
    if (!song) {
        input = "The Sign Ace of Base";
        console.log(song);

    };
    spotify.search({
        type: "track",
        query: input
    }, (function (error, data) {
        if (error) {
            console.log(error);
        } else {
            var output = data.tracks.items[0];

            var divider = "\n-----------------------------------------\n"

            var songData = [
                "Artist: " + output.artists[0].name,
                "Song Name: " + output.name,
                "Spotify Link: " + output.external_urls.spotify,
                "Album: " + output.album.name
            ].join("\n\n");

            fs.appendFile("log.txt", divider + songData + divider, function (error) {
                if (error) throw error;
                console.log(divider + songData + divider);
            });
        }
    }))
};

function getMovie(input) {
    var movie = input
    if (!movie) {
        input = "Mr. Nobody";
    } else {
        movie = input;
    };
    var divider = "\n---------------------------------------------------\n";

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        var movie = JSON.parse(body);

        var movieData = [
            "Title: " + movie.Title,
            "Release Year: " + movie.Year,
            "IMDB Rating: " + movie.imdbRating,
            "Rotten Tomatoes Rating: " + movie.Ratings[1].Value,
            "Country: " + movie.Country,
            "Language: " + movie.Language,
            "Plot: " + movie.Plot,
            "Actors: " + movie.Actors
        ].join("\n\n");

        fs.appendFile("log.txt", divider + movieData + divider, function (error) {
            if (error) throw error;
            console.log(divider + movieData + divider);
        });
    });

};

function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            // console.log(data);

            var dataArr = data.split(",");

            // console.log(dataArr);

            commandSwitch(dataArr[0], dataArr[1]);

            fs.appendFile("log.txt", dataArr, function (error) {
                if (error) throw error;
                console.log(dataArr);
            });
        }
    });
}