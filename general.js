module.exports = {
    name: 'general',
    
    menu: {
        execute: async (sock, message) => {
            const menuText = `
🤖 *RMD BOT MENU* 🤖

📌 *Commandes Générales*
.help - Afficher l'aide
.menu - Afficher ce menu
.infobot - Info du bot
.owner - Info du propriétaire
.stats - Statut du bot
.ping - Test de vitesse

👑 *Commandes Admin*
.ban - Bannir un utilisateur
.kick - Exclure un utilisateur
.promote - Promouvoir admin
.demote - Rétrograder admin
.mute - Rendre muet le groupe
.unmute - Activer le groupe

🎮 *Commandes Jeux*
.slot - Machine à sous
.quiz - Questionnaire
.truth - Action ou vérité
.dare - Action ou vérité
.tictactoe - Morpion
.hangman - Pendu

😄 *Commandes Fun*
.joke - Blague aléatoire
.meme - Meme aléatoire
.quote - Citation inspirante
.fact - Fait intéressant
.roll - Lancer de dé
.flip - Pile ou face

📸 *Commandes Stickers/Images*
.sticker - Créer un sticker
.stickerwm - Sticker avec watermark
.toimg - Sticker en image
.emojimix - Mixer des emojis
.trigger - Image triggered
.circle - Image circulaire

📝 *Text Maker*
.text1 - Style texte 1
.text2 - Style texte 2
.text3 - Style texte 3
.textglitch - Effet glitch
.textneon - Effet néon

⬇️ *Téléchargement*
.ytmp3 - Télécharger audio YouTube
.ytmp4 - Télécharger vidéo YouTube
.igdl - Télécharger Instagram
.fbdl - Télécharger Facebook
.ttdl - Télécharger TikTok

🇯🇵 *Anime*
.waifu - Image waifu aléatoire
.husbando - Image husbando
.animequote - Citation anime
.animeinfo - Info anime
.mangainfo - Info manga

⚙️ *Paramètres BOT*
.on - Activer le bot
.off - Désactiver le bot
.autoread - Activer lecture auto
.antilink - Activer antilien
.welcome - Activer message de bienvenue

🔍 *Recherche*
.google - Recherche Google
.youtube - Recherche YouTube
.wiki - Recherche Wikipédia
.weather - Météo
.covid - Info COVID

📊 *Autres*
.calc - Calculatrice
.reminder - Rappel
.translate - Traduction
.shorten - Raccourcir URL
.currency - Convertisseur de devise

📞 *Contact*
.owner - Contacter le propriétaire
.donate - Faire un don
.report - Signaler un problème

_Créé par RMD • Numéro: +228 96 19 09 34_
            `;
            
            await sock.sendMessage(message.key.remoteJid, { text: menuText });
        }
    },
    
    help: {
        execute: async (sock, message) => {
            await sock.sendMessage(message.key.remoteJid, { 
                text: 'Tapez .menu pour voir toutes les commandes disponibles.' 
            });
        }
    },
    
    infobot: {
        execute: async (sock, message) => {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            const infoText = `
🤖 *RMD BOT INFORMATION* 🤖

*Créateur:* RMD
*Numéro:* +228 96 19 09 34
*Version:* 2.0.0
*Uptime:* ${hours}h ${minutes}m ${seconds}s
*Platform:* Node.js ${process.version}
*Mémoire:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB

_Fonctionne avec Baileys et hébergé sur Render_
            `;
            
            await sock.sendMessage(message.key.remoteJid, { text: infoText });
        }
    },
    
    ping: {
        execute: async (sock, message) => {
            const start = Date.now();
            await sock.sendMessage(message.key.remoteJid, { text: 'Pong!' });
            const end = Date.now();
            await sock.sendMessage(message.key.remoteJid, { 
                text: `🏓 *Pong!* Temps de réponse: ${end - start}ms` 
            });
        }
    }
    
    // Ajouter d'autres commandes générales ici...
};
