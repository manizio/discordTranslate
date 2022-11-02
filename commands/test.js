const {SlashCommandBuilder} = require('discord.js')
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    data: new SlashCommandBuilder().setName('echo').setDescription('echoes input').addStringOption(op => 
        op.setName('input').setDescription('input').setRequired(true)),
    async execute(interaction){
        const input = interaction.options.getString('input')
        await interaction.reply(`${input}`)
    }
}

