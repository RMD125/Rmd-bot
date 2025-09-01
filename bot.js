const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const PHONE_NUMBER = "22896190934";

app.use(express.json());

// Variable pour stocker le code de vérification
let verificationCode = null;
let connectionStatus = "connecting";

// Route principale
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>🤖 RMD Bot - Connexion WhatsApp</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          min-height: 100vh;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        .status {
          padding: 15px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: center;
          font-weight: bold;
        }
        .online { background: #4CAF50; }
        .offline { background: #f44336; }
        .connecting { background: #ff9800; }
        .info-box {
          background: white;
          color: #128C7E;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .step {
          margin: 10px 0;
          padding: 12px;
          background: #e8f5e8;
          border-radius: 8px;
          border-left: 4px solid #25D366;
        }
        .numero {
          font-size: 24px;
          font-weight: bold;
          color: #25D366;
          text-align: center;
          margin: 20px 0;
        }
        .code-display {
          background: white;
          color: #128C7E;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
        }
        .copy-btn {
          background: #25D366;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 RMD Bot WhatsApp</h1>
        <p>Connexion WhatsApp - Développé par <strong>RMD125</strong></p>
        
        <div class="numero">
          📱 +${PHONE_NUMBER}
        </div>

        <div id="status" class="status connecting">
          🔄 En attente du code de vérification...
        </div>

        <div id="codeDisplay" class="code-display" style="display: none;">
          🔢 Votre code: <span id="codeValue"></span>
          <br>
          <button class="copy-btn" onclick="copyCode()">📋 Copier le code</button>
        </div>

        <div class="info-box">
          <h3>📋 Instructions de Connexion</h3>
          <div class="step">
            <strong>1. Ouvrez WhatsApp sur votre téléphone</strong>
          </div>
          <div class="step">
            <strong>2. Allez dans Paramètres → Appareils connectés</strong>
          </div>
          <div class="step">
            <strong>3. Cliquez sur "Connecter avec un numéro de téléphone"</strong>
          </div>
          <div class="step">
            <strong>4. Entrez le numéro: +${PHONE_NUMBER}</strong>
          </div>
          <div class="step">
            <strong>5. Copiez le code ci-dessus et collez-le dans WhatsApp</strong>
          </div>
        </div>

        <div class="info-box">
          <h3>📞 Support RMD125</h3>
          <div class="step">📱 WhatsApp: +228 96 19 09 34</div>
          <div class="step">📱 WhatsApp: +228 96 12 40 78</div>
          <div class="step">⏰ Réponse sous 24h maximum</div>
        </div>
      </div>

      <script>
        function updateStatus(status, message) {
          const statusDiv = document.getElementById('status');
          statusDiv.className = 'status ' + status;
          statusDiv.innerHTML = message;
        }

        function displayCode(code) {
          const codeDisplay = document.getElementById('codeDisplay');
          const codeValue = document.getElementById('codeValue');
          
          codeValue.textContent = code;
          codeDisplay.style.display = 'block';
          updateStatus('connecting', '🔢 Code disponible - Copiez-le dans WhatsApp');
        }

        function copyCode() {
          const code = document.getElementById('codeValue').textContent;
          navigator.clipboard.writeText(code).then(() => {
            alert('Code copié dans le presse-papier!');
          });
        }

        // Vérifier périodiquement si un code est disponible
        setInterval(() => {
          fetch('/get-code')
            .then(response => response.json())
            .then(data => {
              if (data.code) {
                displayCode(data.code);
              }
              if (data.status) {
                updateStatus(data.status, data.message);
              }
            });
        }, 2000);
      </script>
    </body>
    </html>
  `);
});

// Route pour obtenir le code de vérification
app.get('/get-code', (req, res) => {
  let message = '';
  if (connectionStatus === 'connected') {
    message = '✅ Connecté avec succès!';
  } else if (verificationCode) {
    message = '🔢 Code disponible - Copiez-le dans WhatsApp';
  } else {
    message = '🔄 En attente du code de vérification...';
  }
  
  res.json({ 
    code: verificationCode,
    status: connectionStatus,
    message: message
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🤖 Serveur démarré sur le port ${PORT}`);
  console.log(`📱 Configuration pour le numéro: +${PHONE_NUMBER}`);
  console.log(`🌐 Accédez à http://localhost:${PORT} pour voir le code de vérification`);
  initializeWhatsApp();
});

async function initializeWhatsApp() {
  try {
    console.log('🔗 Initialisation de la connexion WhatsApp...');
    
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 10000,
      browser: ['RMD Bot', 'Chrome', '120.0.0.0'],
      // Forcer l'envoi d'un code par SMS
      authMethods: ['sms'],
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, code } = update;
      
      console.log('📡 Statut de connexion:', connection);
      
      if (code) {
        console.log(`📲 Code de vérification reçu: ${code}`);
        verificationCode = code;
        connectionStatus = 'connecting';
      }
      
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('🔌 Déconnecté - Reconnexion dans 10 secondes...');
        connectionStatus = 'offline';
        verificationCode = null;
        setTimeout(() => initializeWhatsApp(), 10000);
      } else if (connection === 'open') {
        console.log('✅ Connecté avec succès à WhatsApp!');
        connectionStatus = 'connected';
        verificationCode = null;
      }
    });

    sock.ev.on('creds.update', saveCreds);
    
    // Gestion des messages
    sock.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];
      if (!message.key.fromMe && m.type === 'notify') {
        await sock.readMessages([message.key]);
        
        const text = getMessageText(message);
        const jid = message.key.remoteJid;
        
        if (text === '!ping') {
          await sock.sendMessage(jid, { text: '🏓 Pong!' });
        }
        else if (text === '!aide') {
          await sock.sendMessage(jid, { text: helpMessage });
        }
        else if (text === '!status') {
          await sock.sendMessage(jid, { text: '✅ Bot RMD en ligne et opérationnel! Développé par RMD125' });
        }
        else if (text === '!tagall') {
          await tagAllMembers(sock, jid);
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('🔄 Nouvelle tentative dans 10 secondes...');
    connectionStatus = 'offline';
    setTimeout(() => initializeWhatsApp(), 10000);
  }
}

async function tagAllMembers(sock, jid) {
  try {
    const groupMetadata = await sock.groupMetadata(jid);
    const participants = groupMetadata.participants;
    
    let mentionText = '📍 *MENTION DE TOUS LES MEMBRES*\n\n';
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]} `;
    });
    
    mentionText += '\n\n🤖 _Mention par RMD Bot_';
    
    await sock.sendMessage(jid, { 
      text: mentionText,
      mentions: participants.map(p => p.id)
    });
  } catch (error) {
    console.error('Erreur tagAllMembers:', error);
  }
}

function getMessageText(message) {
  if (message.message?.conversation) {
    return message.message.conversation;
  }
  if (message.message?.extendedTextMessage?.text) {
    return message.message.extendedTextMessage.text;
  }
  return '';
}

const helpMessage = `
🤖 *RMD BOT - AIDE*

🔧 *Commandes Disponibles:*
!aide - Affiche ce message d'aide
!ping - Test de connexion du bot
!status - Statut du bot
!tagall - Mentionne tous les membres d'un groupe

👑 *Développeur:* RMD125
📞 *Support:* +228 96 19 09 34
`;

// Gestion propre de la fermeture
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du bot...');
  process.exit(0);
});
