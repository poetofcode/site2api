const express = require('express');

const app = express();
const jsonParser = express.json();

const dummy = {
	temp: 'Temp'
}

app.get("/api/users", function(req, res){
       
    res.send(dummy);
});


class Application {

	start(config) {
		this.config = config;
		app.listen(this.config.port, function() {
		    console.log("Сервер ожидает подключения...");
		});	
	}
}

exports.app = new Application();