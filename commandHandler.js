const fs = require('fs');
const path = require('path');

// Charger toutes les commandes
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

const commands = {};

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands[command.name] = command;
}

async function handleCommand(sock, store, message) {
    const body = message.message.conversation || 
                (message.message.extendedTextMessage && message.message.extendedTextMessage.text) || 
                '';
    
    if (!body.startsWith('.')) return;
    
    const args = body.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Trouver la commande
    let command = null;
    for (const category in commands) {
        if (commands[category][commandName]) {
            command = commands[category][commandName];
            break;
        }
    }
    
    if (!command) return;
    
    try {
        await command.execute(sock, message, args, store);
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande:', error);
        await sock.sendMessage(message.key.remoteJid, { 
            text: 'Une erreur s\'est produite lors de l\'exécution de cette commande.' 
        });
    }
}

module.exports = { handleCommand };
