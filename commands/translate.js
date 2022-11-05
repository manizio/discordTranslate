const { SlashCommandBuilder, isJSONEncodable, Embed, EmbedBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");
const progressBar = require('string-progressbar')
const truncate = require('smart-truncate')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate text from one language to another!")
    .addStringOption((op) =>
      op
        .setName("source")
        .setDescription("Set source language")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("target")
        .setDescription("Set target language")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("text")
        .setDescription("Text to be translated")
        .setRequired(true)
        .setMaxLength(220)
    )
    .addIntegerOption((op) =>
      op
        .setName("count")
        .setDescription(
          "How many times the input will be translated"
        )
        .setRequired(true)
    ),
  async execute(interaction) {

    const src = interaction.options.getString("source");
    const tgt = interaction.options.getString("target");
    const txt = interaction.options.getString("text");
    const count = interaction.options.getInteger('count');

    let embed = new EmbedBuilder()

    await interaction.deferReply();
    try{
        const translated = await hyperTranslate(embed, interaction, src, tgt, txt, count);
        embed.setColor(0x4b8bf5)
        .setTitle(`:white_check_mark: Translated!`)
        .setThumbnail('https://i.imgur.com/cC0XqRi.png')
        .setDescription(`**${translated.text}**`)
        .addFields(
              {
                  name:'Original Input', value:`${txt}`
              }
          )

        let path = (count >= 150) ? truncate(translated.path, 20, {position: 12}) : translated.path
        embed.setFooter({text: `Path: ${path}`})
        await interaction.editReply({embeds: [embed]});

    } catch(e){
        await interaction.editReply('**Something went wrong! Please verify your inputs and make sure the language is on the ISO-639-1 format. [see here](https://cloud.google.com/translate/docs/languages) **')
        console.warn(e)
      }
    
  },
};

var supportedLangs = [
  "af",
  "sq",
  "am",
  "ar",
  "hy",
  "az",
  "eu",
  "bn",
  "bs",
  "bg",
  "ca",
  "ceb",
  "zh-CN",
  "zh-TW",
  "co",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "eo",
  "et",
  "fi",
  "fr",
  "fy",
  "gl",
  "ka",
  "de",
  "el",
  "gu",
  "ht",
  "ha",
  "haw",
  "iw",
  "hi",
  "hmn",
  "hu",
  "is",
  "id",
  "ga",
  "ja",
  "jw",
  "kn",
  "kk",
  "km",
  "ko",
  "ku",
  "lo",
  "lv",
  "lt",
  "lb",
  "mk",
  "mg",
  "ms",
  "ml",
  "mt",
  "mi",
  "mr",
  "mn",
  "ne",
  "no",
  "ny",
  "ps",
  "fa",
  "pl",
  "pt",
  "pa",
  "ro",
  "ru",
  "sm",
  "gd",
  "sr",
  "st",
  "sn",
  "sd",
  "si",
  "sk",
  "sl",
  "so",
  "es",
  "sw",
  "sv",
  "tl",
  "tg",
  "ta",
  "te",
  "th",
  "tr",
  "uk",
  "ur",
  "uz",
  "vi",
  "cy",
  "xh",
  "yi",
  "yo",
  "zu",
]; //from HyperTranslate

async function hyperTranslate(embed, interaction, src, tgt, text, count) {
  
  let progress = 0;
  let langProgress;
  let currentLang;
  let currentTgt = supportedLangs[random(supportedLangs)];
  let transText = text;

  currentLang = src;

  langProgress = `${currentLang} `;

  embed
        .setColor(0x4b8bf5)
        .setTitle(`Translating... :hourglass_flowing_sand:`)
        .setThumbnail('https://i.imgur.com/cC0XqRi.png')

  while (progress < count -2) {
    
    let res = await translate(transText, { from: currentLang, to: currentTgt });

    transText = res.text;
    //console.log(transText)

    currentLang = currentTgt;

    langProgress += `-> ${currentTgt} `
    currentTgt = supportedLangs[random(supportedLangs)];
    progress++;
    const bar = progressBar.filledBar(count, progress+2, size = 20, line = '⬜', slider = '🟩')
    embed.setDescription(`${bar[0]}`)
    embed.setFooter({text: `Progress: ${Math.round(bar[1])}%`})
    interaction.editReply({embeds:[embed]})
    
  }
  let res = await translate(transText, { from: currentLang, to: tgt });
  langProgress += `-> ${tgt}`;
  transText = res.text;

  const translation = {
    text: transText,
    path: `${langProgress}`
  }
  return translation;
}


function random(arr) {
  return Math.floor(Math.random() * arr.length);
}
