import { Context, VK } from 'vk-io'

import { config } from '../config'
import hearManager from './handlers'


const vk: VK = new VK({
    token: config.vk.token
})

vk.updates.on('message_new', hearManager.middleware)

vk.updates.on('chat_invite_user', async (context: Context) => {
    console.log(context)
    if (context.eventMemberId !== config.vk.selfId) {
        await context.send('И хуль ты приперся?')
        await context.send('а?')
        await context.send({
            sticker_id: 51648
        })
    } else {
        await context.send('Ну здарова')
        await context.send({
            sticker_id: 51669
        })

        const users = await vk.api.messages.getConversationMembers({
            peer_id: 2000000001
        })
        console.log(users.items.map(user => user.conversation))
    }
})
vk.updates.on('chat_kick_user', async (context: Context) => {
    await context.send('Фу, слабый')
    await context.send({
        sticker_id: 51636
    })
})

vk.updates.start()
    .then(() => console.log('Bot started'))
    .catch(console.error)

export { vk }