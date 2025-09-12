module.exports = {
    name: 'admin',
    
    ban: {
        execute: async (sock, message, args) => {
            if (!message.key.remoteJid.endsWith('@g.us')) {
                return await sock.sendMessage(message.key.remoteJid, { 
                    text: 'Cette commande ne peut être utilisée que dans un groupe.' 
                });
            }
            
            // Implémenter la logique de bannissement
            await sock.sendMessage(message.key.remoteJid, { 
                text: 'Fonction de bannissement en développement.' 
            });
        }
    },
    
    kick: {
        execute: async (sock, message, args) => {
            if (!message.key.remoteJid.endsWith('@g.us')) {
                return await sock.sendMessage(message.key.remoteJid, { 
                    text: 'Cette commande ne peut être utilisée que dans un groupe.' 
                });
            }
            
            // Implémenter la logique d'expulsion
            await sock.sendMessage(message.key.remoteJid, { 
                text: 'Fonction d\'expulsion en développement.' 
            });
        }
    }
    
    // Ajouter d'autres commandes admin ici...
};
