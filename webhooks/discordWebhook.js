const axios = require('axios');

class DiscordWebhook {
    constructor() {
        this.webhookUrl = process.env.DISCORD_WEBHOOK_URL; // Load from .env
    }

    async sendMessage(content) {
        try {
            const payload = {
                content, // Message to send
                username: 'Nexio-EventSphere',
                avatar_url: 'https://images-ext-1.discordapp.net/external/gGNbYZMIMU6Yky8mr3dpMBtO9kzYGiYjCh4Fiuudm2g/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1318606973952065637/5e9336bdf3dba1bd9baacf35746d00d9.png?quality=lossless&format=webp&width=823&height=823' // Optional bot icon
            };

            await axios.post(this.webhookUrl, payload);
        } catch (error) {
            console.log('Error sending message to Discord', error.response?.data || error.message);
        }
    }
}

module.exports = new DiscordWebhook();
