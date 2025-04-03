const chalk = require('chalk');
const moment = require('moment');

class ConsoleLogs {
    static log(level, message, data = null) {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        if (data) {
            logMessage += ` | Data: ${JSON.stringify(data, null, 2)}`;
        }

        switch (level) {
            case 'info':
                console.log(chalk.blue(logMessage));
                break;
            case 'warn':
                console.warn(chalk.yellow(logMessage));
                break;
            case 'error':
                console.error(chalk.red(logMessage));
                break;
            case 'debug':
                console.debug(chalk.magenta(logMessage));
                break;
            default:
                console.log(logMessage);
        }
    }

    static info(message, data = null) {
        this.log('info', message, data);
    }

    static warn(message, data = null) {
        this.log('warn', message, data);
    }

    static error(message, data = null) {
        this.log('error', message, data);
    }

    static debug(message, data = null) {
        this.log('debug', message, data);
    }
}

module.exports = ConsoleLogs;
