const { Client, RichEmbed } = require('discord.js')
const client = new Client()

const fetchMessages = async (channel, userId, before) => {
  const messages = await channel.fetchMessages({ limit: 100, before: before })

  if (messages.size > 0) {
    const userMessages = messages.filter(message => message.author.id === userId)
    let msgLast

    if (userMessages.size > process.env.LIMIT) return true

    if (messages.last().author.id === userId) msgLast = messages.array()[messages.array().length - 1].id
    else msgLast = messages.last().id

    return fetchMessages(channel, userId, msgLast)
  } else {
    return Promise.resolve()
  }
}

client.on('ready', () => {
  console.log('I\'m ready!')
})

client.on('message', (message) => {
  if (message.channel.id === process.env.CHANNEL_ID && !message.author.bot) {
    fetchMessages(message.channel, message.author.id).then(m => {
      if (m) {
        message.delete(1000)
        message.channel.send(
          new RichEmbed()
            .setDescription(`> **Error:** You can't post more than ${process.env.LIMIT} messages here!`)
            .setColor('#c45151')
        ).then(m => m.delete(3000))
      }
    })
  }
})

client.login(process.env.TOKEN)
