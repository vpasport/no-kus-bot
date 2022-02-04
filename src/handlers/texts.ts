import { Attachment, Context, MessageContext } from 'vk-io'
import { HearManager } from '@vk-io/hear'

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

const AnnaHendler = async (context: MessageContext) => {
    await context.send('/стрела @kjushka')
}

const index = (hearManager: HearManager<Context>) => {
    hearManager.hear(/[Хх][Уу][Йй]/g, huiHandler)
    hearManager.hear((value: string | undefined): boolean => value !== undefined && /секс/.test(value.toLowerCase()), sexHandler)

    hearManager.hear(
        (_, context: MessageContext): boolean => context?.attachments[0]?.constructor.name === 'AudioMessageAttachment' && Math.random() > 0.5,
        audioHandler
    )
    hearManager.hear(
        (_, context: MessageContext): boolean => context?.attachments[0]?.constructor.name === 'VideoAttachment' && context.senderId === 78038002 && Math.random() > 0.5,
        MikhailVideoHandler
    )
    hearManager.hear(
        (_, context: MessageContext): boolean => context?.attachments[0]?.constructor.name === 'VideoAttachment' && context.senderId === 114256649 && Math.random() > 0.5,
        AnnaHendler
    )
    hearManager.hear((_) => true, AnnaHendler)
}

export default index