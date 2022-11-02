const {Events} = require('discord.js')


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command){
            console.error(`No command matching ${interaction.commandName} found`)
            return
        }

        try{
            await command.execute(interaction);
        } catch (e){
            console.error (`Error executing ${interaction.commandName}`)
            console.error(e)
        }
    }
}