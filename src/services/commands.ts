import { commands as commandsRepository } from '../database'

const addBans = async (chatId: number, userId: number): Promise<number | null> => {
    return await commandsRepository.addBan(chatId, userId)
}

const addRespect = async (chatId: number, userId: number): Promise<number | null> => {
    return await commandsRepository.addRespect(chatId, userId)
}

export {
    addBans,
    addRespect
}