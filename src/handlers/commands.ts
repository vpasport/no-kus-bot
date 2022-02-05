import { Context, MessageContext } from 'vk-io'
import { HearManager } from "@vk-io/hear"

import { commands as commandsService } from '../services'
import { IdsValidator } from '../utils'

// const startHandler = async (context: Context) => {
//     await context.send('Привет')
// }

const getStatHandler = async (context: MessageContext) => {
    const result = await commandsService.getStats(context.peerId)

    await context.send(result)
    await context.send({ sticker_id: 51664 })
}

const banResponses: string[] = ['Поддерживаю', 'Туда его', 'Так ему и надо', 'Заслужил, как по мне', 'Сыглы', 'Согласен']
const banHandler = async (context: MessageContext) => {
    const [type, result] = new IdsValidator(
        'forward',
        context,
        {
            noReply: () => context.reply('Дурак бля, кому я бан прописать должен?\nТебе может прописать?\nЧтоб знал, что его в ответ на сообщение писать надо'),
            normalReply: (val) => context.reply(`${banResponses[Math.floor(Math.random() * banResponses.length)]}\n${val} - а это количество его банов`),
            selfReply: (val) => context.reply(`Самоуничтожился, получаетя\nНу ладно, мешать не буду\nКста, ${val} - это количество твоих банов`),
            replyToBot: () => context.reply('Себе бан пропиши'),
            replyToOtherBot: (val) => context.reply(`${banResponses[Math.floor(Math.random() * banResponses.length)]}\n${val} - а это количество его банов`),
        }
    ).validate()

    if (typeof result === 'function') {
        if (type !== IdsValidator.ResultTypes.noReply) {
            const newBansCount = await commandsService.addBans(context.peerId, context.replyMessage!.senderId)

            if (newBansCount) {
                await result(`${newBansCount}`)
                return
            }
            console.error('Не удалось увеличить счетчик банов')
        } else {
            result()
            return
        }
    }

    await context.send('У моего раба, который меня создал, беды с башкой, поэтому не помню, как мне на это реагировать')
}

const respectResponses: string[] = ['Ну вы посмотриет на этого красавца', 'Мое уважение, уважаемый', 'Мое увлажнение', 'Не, ну вы псомотрите на него']
const respectHandler = async (context: MessageContext) => {
    const [type, result] = new IdsValidator(
        'forward',
        context,
        {
            noReply: () => context.reply('Кому респект то? Кому? На сообщение ответь, дурак'),
            normalReply: (val) => context.reply(`${respectResponses[Math.floor(Math.random() * banResponses.length)]}\n${val} - а это его респект`),
            selfReply: () => context.reply('У нас тут так не принято'),
            replyToBot: () => context.reply('Ля, пасибо, но вам, жалким созданиям, меня и так не догнать'),
            replyToOtherBot: () => context.reply('Не не не\nЭтому я ничего ставить не буду')
        }
    ).validate()

    if (typeof result === 'function') {
        if (type === IdsValidator.ResultTypes.normalReply) {
            const newRespectsCount = await commandsService.addRespect(context.peerId, context.replyMessage!.senderId)

            if (newRespectsCount) {
                await result(`${newRespectsCount}`)
                return
            }
            console.error('Не удалось увеличить счетчик респектов')
        } else {
            result()
            return
        }
    }

    await context.send('У моего раба, который меня создал, беды с башкой, поэтому не помню, как мне на это реагировать')
}

const index = (hearManager: HearManager<Context>): void => {
    // hearManager.hear('/start', startHandler)
    hearManager.hear('/stats', getStatHandler)

    hearManager.hear(
        (value: string | undefined): boolean => !!value && /\s?(бан|ban|осуждаю|👎)\s?/gm.test(value.toLowerCase()),
        banHandler
    )
    hearManager.hear(
        (value: string | undefined): boolean =>
            !!value && /\s?(respect|респект|уважение|красава|красавчик|увлажнение|заебись|👍)\s?/gm.test(value.toLowerCase()),
        respectHandler
    )
}

export default index