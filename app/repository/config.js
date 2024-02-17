var fs = require('fs');

class ConfigRepository {

    constructor(context) {
        // Дефолтный конфиг
        this.config = {
            login: "admin",
            password: "admin",
            debug_enabled: false,
            debug_key: "secretkey",
            api_key: "secret-api-key"
        }
    }

    saveConfig(config) {
        try {
            this.config.debug_enabled = config.debug_enabled;
            this.config.debug_key = config.debug_key;
            this.config.login = config.login;
            this.config.password = config.password;
            this.config.api_key = config.api_key;
            fs.writeFileSync('./app/config/config.json', JSON.stringify(this.config));
        } catch (err) {
            console.log("Error saving config", err);
        }
    }
    

    fetchConfig() {
        try {
            const config = JSON.parse(fs.readFileSync('./app/config/config.json', 'utf8'));
            this.config.debug_enabled = config.debug_enabled || this.config.debug_enabled;
            this.config.debug_key = config.debug_key || this.config.debug_key;
            this.config.login = config.login || this.config.login;
            this.config.password = config.password || this.config.password;
            return this.config;
        } catch (err) {
            console.log("Error saving config", err);
            return this.config;
        }
    }

}

exports.ConfigRepository = ConfigRepository;