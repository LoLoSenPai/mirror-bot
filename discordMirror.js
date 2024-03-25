const { Client, WebhookClient, MessageFlags } = require('discord.js-selfbot-v13');

const config = require('./config.json');
const client = new Client({ checkUpdate: false });

const webhooksMap = new Map();
config.mappings.forEach(mapping => {
  webhooksMap.set(mapping.source_channel_id, new WebhookClient({
    token: mapping.webhook.token,
    id: mapping.webhook.id
  }));
});

client.on('ready', async () => {
  console.log(`${client.user.username} is now mirroring >:)!`);
});

client.on('messageCreate', async (message) => {
  if (message.content.length == 0 && message.embeds.length == 0) {
    return;
  }

  if (message.flags && MessageFlags.Ephemeral) {
    return;
  }

  const webhook = webhooksMap.get(message.channelId);
  if (!webhook) {
    return;
  }

  const content = message.content.length ? message.content : " ";
  webhook.send({
    content: content,
    username: message.author.username,
    avatarURL: message.author.avatarURL(),
    embeds: message.embeds
  });
});

client.login(config["token"]);