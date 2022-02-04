import { Attachment, Context, MessageContext } from 'vk-io'
import { HearManager } from '@vk-io/hear'
import { commands as commandsService } from '../services'

const huiHandler = async (context: MessageContext) => {
    await context.send('Сам ты хуй')
}

const sexHandler = async (context: MessageContext) => {
    await context.send('Секс — половые отношения у людей и животных\nЭт если верить википедии\nНо я не ебу, я ж не животное ебаное')
}

const audioHandler = async (context: MessageContext) => {
    await context.send('Не смотря на то, что моя жалкая копия тебя хейтит за голосовые, знай, он пидарас, а ты просто пидор')
}

const MikhailVideoHandler = async (context: MessageContext) => {
    if (Math.random() > 0.2) await context.send('Да ты заебал')
    else await context.send({
        attachment: [
            'video155888143_456239386_ece6dfdc57d8be1f57'
        ]
    })
}

const ArrowHandler = async (context: MessageContext) => {
    await context.send('/стрела @kusbot')
}

const kusBotHandler = async (context: MessageContext) => {
    await context.reply('Старина, СЪЕБИ НАХУЙ')
}

const assVariants = ['Бля, жопа болит', 'Я сосал, меня ебали', 'Я ебал, меня сосали']
const assHandler = async (context: MessageContext) => {
    await context.send(assVariants[Math.floor(Math.random() * assVariants.length)])
}

const wishHandler = async (context: MessageContext) => {
    await context.reply('Смотрете, клоун')
    await context.send({
        sticker_id: 51636
    })
}

const fuckHandler = async (contex: MessageContext) => {
    await contex.send('Не говори братан')
}

const kusBotCommandNotFoundHandler = async (contex: MessageContext) => {
    await contex.reply('Да это не тебе, урод вонючий')
    await contex.send({
        sticker_id: 51671
    })
}

const changeNameHandler = async (context: MessageContext) => {
    const match = context.text && /я ([а-яА-Я0-9_]+)/gm.exec(context.text)

    if (match && match[1].length <= 20) {
        const result = await commandsService.updateUserNameInfo(context.senderId, context.peerId, match[1])

        if (result) {
            context.send('Я запомнил')
            context.send({ sticker_id: 51662 })
        }
    }
}

const index = (hearManager: HearManager<Context>) => {
    hearManager.hear((val: string | undefined): boolean => val !== undefined && /хуй/g.test(val.toLowerCase()), huiHandler)
    hearManager.hear((value: string | undefined): boolean => value !== undefined && /секс/.test(value.toLowerCase()), sexHandler)
    hearManager.hear((value: string | undefined): boolean => value !== undefined && /я ([а-яА-Я]{1,20})/gm.test(value.toLowerCase()), changeNameHandler)

    hearManager.hear(
        (_, context: MessageContext): boolean => context?.attachments[0]?.constructor.name === 'AudioMessageAttachment' && Math.random() > 0.5,
        audioHandler
    )
    hearManager.hear(
        (value: string | undefined, context: MessageContext): boolean =>
            ((value && /youtube/g.test(value.toLowerCase())) ||
                (context?.attachments[0]?.constructor.name === 'VideoAttachment' && context.senderId === 78038002)) &&
            Math.random() > 0.5,
        MikhailVideoHandler
    )
    // hearManager.hear(
    //     (_, context: MessageContext): boolean => context?.attachments[0]?.constructor.name === 'VideoAttachment' && context.senderId === 114256649 && Math.random() > 0.5,
    //     () => { }
    // )
    hearManager.hear((val: string | undefined): boolean => val !== undefined && /стрела/g.test(val.toLowerCase()), ArrowHandler)
    hearManager.hear((val: string | undefined): boolean => val !== undefined && /пиздец/g.test(val.toLowerCase()), fuckHandler)
    hearManager.hear((val: string | undefined) => val !== undefined && /жопа/g.test(val.toLowerCase()) && Math.random() < 0.6, assHandler)
    hearManager.hear((val: string | undefined, context: MessageContext) =>
        context.senderId === -192337472 && val !== undefined && (/хоч/g.test(val.toLowerCase()) || /хот/g.test(val.toLowerCase()))
        , wishHandler)
    hearManager.hear((val: string | undefined, context: MessageContext) =>
        context.senderId === -192337472 && val !== undefined && (/команда не найдена/g.test(val.toLowerCase()))
        , kusBotCommandNotFoundHandler)
    hearManager.hear((_, context: MessageContext) => context.senderId === -192337472 && Math.random() < 0.3, kusBotHandler)
    // hearManager.hear((_, context: MessageContext) => (console.log(context), true), () => { })
}

export default index