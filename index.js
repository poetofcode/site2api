const app = require('./app').app;

const config = {
	port: 3000,
	db: {
		name: "site2api"
	}
};

(async () => {
	try {
		await app.start(config);
	    console.log("Сервер ожидает подключения...");
	} catch(err) {
	    return console.log(err);
	} 
})();