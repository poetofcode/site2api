const app = require('./app').app;

const config = {
	port: 3000,
	db: {
		name: "site2api"
	}
};

(async () => {
	try {
		console.log("Starting...");
		await app.start(config);
	    console.log(`Server running: http://127.0.0.1:${config.post}/console`);
	} catch(err) {
	    return console.log(err);
	} 
})();
