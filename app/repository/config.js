class ConfigRepository {

    constructor(context) {
        // Дефолтный конфиг
        this.config = {
            debug_enabled: false,
            debug_key: "secretkey"
        }
    }

    saveConfig(config) {
        try {
            this.config.debug_enabled = config.debug_enabled;
            this.config.debug_key = config.debug_key;
            fs.writeFileSync('./app/config/config.json', JSON.stringify(this.config));
        } catch (err) {
            console.error("Error saving config", err);
        }
    }
    

    fetchConfig() {
        try {
            const config = JSON.parse(fs.readFileSync('./app/config/config.json', 'utf8'));
            this.config.debug_enabled = config.debug_enabled;
            this.config.debug_key = config.debug_key;
            return this.config;
        } catch (err) {
            console.error("Error saving config", err);
            return this.config;
        }
    }

}

exports.ConfigRepository = ConfigRepository;