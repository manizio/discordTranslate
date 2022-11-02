const { SlashCommandBuilder, isJSONEncodable } = require("discord.js");
const translate = require("@iamtraction/google-translate");

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
    )
    .addStringOption((op) =>
      op
        .setName("count")
        .setDescription(
          "How many times the input will be translated DEFAULT: 100"
        )
    ),
  async execute(interaction) {
    const src = interaction.options.getString("source");
    const tgt = interaction.options.getString("target");
    const txt = interaction.options.getString("text");
    const count = parseInt(interaction.options.getString("count")) ?? 10;

    await interaction.deferReply();
    const translated = await hyperTranslate(src, tgt, txt, count);
    await interaction.editReply(
      `Original input: ${txt}\nTranslated input: ${translated}`
    );
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

async function hyperTranslate(src, tgt, text, count) {
  let progress = 0;
  let langProgress;
  let currentLang;
  let currentTgt = supportedLangs[random(supportedLangs)];
  let transText = text;

  currentLang = src;

  langProgress = `${currentLang} -> ${currentTgt} `;

  while (progress < count) {
    let res = await translate(transText, { from: currentLang, to: currentTgt });

    transText = res.text;

    currentLang = currentTgt;

    currentTgt = supportedLangs[random(supportedLangs)];

    langProgress += `-> ${currentTgt} `;
    progress++;
  }
  let res = await translate(transText, { from: currentLang, to: tgt });
  langProgress += `-> ${tgt}`;
  transText = res.text;

  return transText;
}


function random(arr) {
  return Math.floor(Math.random() * arr.length);
}
