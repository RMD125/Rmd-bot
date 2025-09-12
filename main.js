const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

const { handleCommand } = require('./handlers/commandHandler');
const { handleMessage } = require('./handlers/messageHandler');
const { handleConnection } = require('./handlers/connectionHandler');

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
store.readFromFile('./data/store.json');

setInterval(() => {
    store.writeToFile('./data/store.json');
}, 10000);

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./data/auth_info');
    
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        getMessage: async (key) => {
            return {
                conversation: 'hello'
            }
        }
    });
    
    store.bind(sock.ev);
    
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        handleConnection(update, sock);
    });
    
    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message.key.fromMe && m.type === 'notify') {
            await handleMessage(sock, store, message);
            await handleCommand(sock, store, message);
        }
    });
    
    return sock;
}

connectToWhatsApp().catch(err => console.log(err));
