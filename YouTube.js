// YouTube Class
var YouTube = function(id, title, url, description, language){

    // type checking
	if(typeof id === "undefined") return console.error("An error occured.. Missing id");
	if(typeof title === "undefined") return console.error("An error occured.. Missing title");
	if(typeof url === "undefined") return console.error("An error occured.. Missing url");

	// Constructor
	this.id = id;
	this.title = title;
	this.url = url;
	this.description = description || "";
	this.language = language || "";

};

module.export = "YouTube";