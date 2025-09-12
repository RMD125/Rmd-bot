const { generateWARegistration } = require('@adiwajshing/baileys');
const axios = require('axios');

let sock = null;

async function handleConnection(update, socket) {
    sock = socket;
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
        console.log('QR Code reçu, mais nous utilisons la méthode code');
    }
    
    if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut);
        console.log('Connexion fermée, reconnexion: ', shouldReconnect);
        if (shouldReconnect) {
            connectToWhatsApp();
        }
    } else if (connection === 'open') {
        console.log('Bot connecté avec succès!');
        
        // Changer le statut du bot
        await sock.updateProfileStatus('RMD BOT 🤖 par RMD | Tapez .menu');
        
        console.log('Bot prêt à recevoir des commandes');
    }
}

// Fonction pour obtenir le code d'inscription
async function getCode(number) {
    try {
        const { registration } = await generateWARegistration({
            phoneNumber: number
        });
        
        return registration.code;
    } catch (error) {
        console.error('Erreur lors de la génération du code:', error);
        return null;
    }
}

module.exports = { handleConnection, getCode };
