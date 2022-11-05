require('dotenv').config()
const {Client, Collection, GatewayIntentBits} = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const TOKEN = process.env.TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))

commandFiles.map(f => {
        const filePath = path.join(commandsPath, f)
        const command = require(filePath)

        client.commands.set(command.data.name, command)
    }
)

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))

eventFiles.map(f => {
    const filePath = path.join(eventsPath, f);
    const event = require(filePath)

    if (event.once){
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
})

client.login(TOKEN)