var express = require("express");
var yt = require('youtube-data');
var fs = require("fs");


var YouTube = function(id, title, url, pub, description){
    // type checking
	if(typeof id === "undefined") return console.error("An error occured.. Missing id");
	if(typeof title === "undefined") return console.error("An error occured.. Missing title");
	if(typeof url === "undefined") return console.error("An error occured.. Missing url");

	// Constructor
	this.id = id;
	this.title = title;
	this.permalink = url;
	this.publishDate = pub;
	this.description = description || "";
};

var app = express.createServer();

app.get('/', function(req, res){

	var videos = [];
	var startingNumber = 1;
	var isComplete = false;

	var template_row = [
		'<tr>\n',
			'<td><table>{{object}}<tr><td></td><td></td></tr><tr><td></td><td></td></tr></table></td>\n',
		'</tr>\n\n'
	].join("");

	var template_data = [
		'<tr>\n',
			'<td>{{key}}</td>\n',
			'<td>{{value}}</td>\n',
		'</tr>\n'
	].join("");

	var result = "";

	var q = function() {
		
		yt.query()
			.videos('cocacola')
			.results(25)
			.startAt( startingNumber )
			.all()
			.run(function(err, data){
				
				if (err) return console.error(err);

				for (var i = 0; i < data.feed.entry.length; i++) {

					var e = data.feed.entry[i];

					var _id = e["media$group"]["yt$videoid"]["$t"];
					var _title = e["title"]["$t"];
					var _url = e["link"][0]["href"];
					var _pub = e["published"]["$t"];
					var _desc = e["media$group"]["media$description"]["$t"];


					var Video = new YouTube(_id, _title, _url, _pub, _desc);

					videos.push(Video);

				};

				startingNumber = startingNumber + 25;

				if (startingNumber > 100) {
					isComplete = true;
				};

				console.log(startingNumber, isComplete);

				if (isComplete) {

					for (var i = 0; i < videos.length; i++) {
						var v = videos[i];
						var _temp = "";

						for(var o in v){
							_temp += template_data
								.replace("{{key}}", o)
								.replace("{{value}}", v[o]);
						};

						result += template_row.replace("{{object}}", _temp);

					};

					// return res.json(videos);
					fs.writeFile("videos.json", JSON.stringify(videos), function(err) {
						if(err) {
							console.log(err);
						} else {
							console.log("The json file was saved!");
						};
					}); 

					// return res.json(videos);
					fs.writeFile("videos.xls", "<html>\n<head></head>\n<body>\n<table>\n<tbody>\b" + result + "</tbody>\n</table>\n</body>\n</html>", function(err) {
						if(err) {
							console.log(err);
						} else {
							console.log("The html file was saved!");
						};
					}); 

					return res.end();
				};

				q();

			});

	};

	q();
	

});

app.listen(3000);