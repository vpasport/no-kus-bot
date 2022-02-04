import { commands as commandsRepository } from '../database'

const getStats = async (chatId: number): Promise<string> => {
    const result = await commandsRepository.getStats(chatId)

    if (result) {
        let statStr = '⚠️‼️ВНИМАНИЕ, ВНИМАНИЕ‼️⚠️👇👇👇\n❌Статистика по банам:\n'
        result.bans.map(el => !!el.bans && (statStr += `${el.bans} - @id${el.user_id} (${el.user_name})\n`))

        statStr += '\n✅Статистика по респектам:\n'
        result.respects.map(el => !!el.respects && (statStr += `${el.respects} - @id${el.user_id} (${el.user_name})\n`))

        statStr += `\n⚠️Общее количество:\n❌${result.bansSum} - баны\n✅${result.respectsSum} - респекты\n\nКак-то так`
        return statStr
    }

    return 'Статистика не найдена'
}

const updateUserNameInfo = async (userId: number, chatId: number, name: string) => {
    return await commandsRepository.updateUserNameInfo(userId, { chatId, name })
}

const addBans = async (chatId: number, userId: number): Promise<number | null> => {
    return await commandsRepository.addBan(chatId, userId)
}

const addRespect = async (chatId: number, userId: number): Promise<number | null> => {
    return await commandsRepository.addRespect(chatId, userId)
}

export {
    getStats,
    updateUserNameInfo,
    addBans,
    addRespect
}