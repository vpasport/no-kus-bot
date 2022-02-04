import { Context, MessageContext } from 'vk-io'
import { HearManager } from "@vk-io/hear"

import { config } from '../../config'

import { commands as commandsService } from '../services'
import { IdsValidator } from '../utils'

const startHandler = async (context: Context) => {
    await context.send('Привет')
}

const banWords: RegExp[] = [/бан/g, /👎/g, /осуждаю/g]
const banResponses: string[] = ['Поддерживаю', 'Туда его', 'Так ему и надо']
const banHandler = async (context: MessageContext) => {
    const [type, result] = new IdsValidator(
        'forward',
        context,
        {
            noReply: 'Дурак бля, кому я бан прописать должен?\nТебе может прописать?\nЧтоб знал, что его в ответ на сообщение писать надо',
            normalReply: (val) => `${banResponses[Math.floor(Math.random() * banResponses.length)]}\n${val} - а это количество его банов`,
            selfReply: (val) => `Самоуничтожился, получаетя\nНу ладно, мешать не буду\nКста, ${val} - это количество твоих банов`,
            replyToBot: 'Себе бан пропиши'
        }
    ).validate()


    if ([IdsValidator.ResultTypes.selfReply, IdsValidator.ResultTypes.normalReply].includes(type) && context.replyMessage) {
        const newBansCount = await commandsService.addBans(context.peerId, context.replyMessage.senderId)
        if (newBansCount && typeof result === 'function') await context.send((() => result(`${newBansCount}`))())
    }
    else if (typeof result === 'string') {
        if (type === IdsValidator.ResultTypes.noReply) await context.reply(result)
        else await context.send(result)
    }
    else await context.send('У моего раба, который меня создал, беды с башкой, поэтому не помню, как мне на это реагировать')
}

const respectWords: RegExp[] = [/респект/g, /красава/g, /красавчик/g, /👍/g, /увлажнение/g]
const respectResponses: string[] = ['Ну вы посмотриет на этого красавца', 'Мое уважение, уважаемый', 'Мое увлажнение', 'Не, ну вы псомотрите на него']
const respectHandler = async (context: MessageContext) => {
    const [type, result] = new IdsValidator(
        'forward',
        context,
        {
            noReply: 'Кому респект то? Кому? На сообщение ответь, дурак',
            normalReply: (val) => `${respectResponses[Math.floor(Math.random() * banResponses.length)]}\n${val} - а это его респект`,
            selfReply: 'У нас тут так не принято',
            replyToBot: 'Ля, пасибо, но вам, жалким, меня и так не догнать'
        }
    ).validate()

    // console.log(type, context)

    if ([IdsValidator.ResultTypes.normalReply].includes(type) && context.replyMessage) {
        const newRespectCount = await commandsService.addRespect(context.peerId, context.replyMessage.senderId)
        if (newRespectCount && typeof result === 'function') await context.send((() => result(`${newRespectCount}`))())
    }
    else if (typeof result === 'string') {
        if (type === IdsValidator.ResultTypes.noReply) await context.reply(result)
        else await context.send(result)
    }
    else await context.send('У моего раба, который меня создал, беды с башкой, поэтому не помню, как мне на это реагировать')
}

const index = (hearManager: HearManager<Context>): void => {
    hearManager.hear('/start', startHandler)

    hearManager.hear(
        (
            value: string | undefined,
            context: Context
        ): boolean => {
            if (value && banWords.map(el => el.test(value.toLowerCase())).filter(el => el).length > 0) return true
            else return false
        },
        banHandler
    )
    hearManager.hear(
        (
            value: string | undefined,
            context: Context
        ): boolean => {
            if (value && respectWords.map(el => el.test(value.toLowerCase())).filter(el => el).length > 0) return true
            return false
        },
        respectHandler
    )
}

export default index