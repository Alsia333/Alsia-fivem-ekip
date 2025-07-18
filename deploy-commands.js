const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Ana komutları yükle
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

// Sagtık (Context Menu) komutlarını yükle
const sagtikPath = path.join(__dirname, 'commands');
if (fs.existsSync(sagtikPath)) {
    const sagtikFiles = fs.readdirSync(sagtikPath).filter(file => file.endsWith('.js'));
    for (const file of sagtikFiles) {
        const filePath = path.join(sagtikPath, file);
        const command = require(filePath);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Slash komutları ve Context Menu komutları yükleniyor...');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Tüm komutlar başarıyla yüklendi!');
    } catch (error) {
        console.error(error);
    }
})();
