import { getPool } from './pg'

const pool = getPool()

const addBan = async (chatId: number, userId: number): Promise<number | null> => {
    const client = await pool.connect()
    await client.query('begin')

    try {
        const result = await client.query(
            `insert into group_users
                (group_id, user_id, bans)
            values
                ($1, $2, 1)
            on conflict(group_id, user_id)
            do update 
                set bans = group_users.bans + 1
            returning bans`,
            [chatId, userId]
        )

        await client.query('commit')
        client.release()

        return result.rows[0].bans
    } catch (e) {
        await client.query('rollback')
        client.release()
        console.error(e)

        return null
    }
}

const addRespect = async (chatId: number, userId: number): Promise<number | null> => {
    const client = await pool.connect()
    await client.query('begin')

    try {
        const result = await client.query(
            `insert into group_users
                (group_id, user_id, respects)
            values
                ($1, $2, 1)
            on conflict(group_id, user_id)
            do update
                set respects = group_users.respects + 1
            returning respects`,
            [chatId, userId]
        )

        await client.query('commit')
        client.release()

        return result.rows[0].respects
    } catch (e) {
        await client.query('rollback')
        client.release()
        console.error(e)

        return null
    }
}

export {
    addBan,
    addRespect
}