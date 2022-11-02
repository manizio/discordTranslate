require('dotenv').config()
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path')

const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID
const TOKEN = process.env.TOKEN

const commands = [];

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))




commandFiles.map(f => {
    const command = require(`./commands/${f}`)

    commands.push(command.data.toJSON())
})

const rest = new REST({ version: '10' }).setToken(TOKEN);


(async () => {
    try{
        console.log(`REFRESHING ${commands.length} SLASH COMMANDS`)

        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID),{body:commands}
        )

        console.log(`LOADED ${data.length} SLASH COMMANDS`)
    } catch(e){
        console.error(e)
    }
})()