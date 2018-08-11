# Liri-Bot Node Application

## About this Application
This application utilizes the Twitter, Spotify, and OMDB APIs to retrieve data based on user commands entered into the terminal utilizing Node.js.

Users must supply their own Twitter and Spotify credentials to access the APIs.

The commands and output are logged to a text file named `log.txt`.

## How to Use It
* Users type in their commands by first typing node, the name of the Javascript file (in this case, `liri.js`), and then one of the following commands:
1. `movie-this` - This command will access the OMBD API to return information about a specific movie.
    * For example, typing `node liri.js movie-this up` will return information about the 2009 animated film "Up."
    * Typing  `node liri.js movie-this` without a film identified will return information about the film "Mr. Nobody."
    * The application is able to handle titles provided with or without quotation marks. For example, `node liri.js movie-this "remember the titans"`, `node liri.js movie-this 'remember the titans'`, and `node liri.js movie-this remember the titans` will all return the same information.
2. `my-tweets` - This command will access the Twitter API to display 20 tweets from an account used specifically for this project.
3. `spotify-this-song` - This command will access the Spotify API to return information about a song. Please use quotation marks when searching to ensure the most accurate results. 
4. `do-what-it-says` - This command reads data from the `random.txt` file to execute commands written in the file. Commands must be changed in the file and must be those defined above. The default command is to run `spotify-this-song` for the track "I Want It That Way."