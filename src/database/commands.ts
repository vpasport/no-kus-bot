import { getPool } from './pg'
import { vk } from '../app'

const pool = getPool()

interface GroupUser {
    user_id?: number,
    group_id?: number,
    bans?: number,
    respects?: number,
    user_name?: string
}

interface GroupStat {
    bans: GroupUser[],
    respects: GroupUser[],
    respectsSum: number,
    bansSum: number
}

const getStats = async (chatId: number): Promise<null | GroupStat> => {
    const client = await pool.connect()
    await client.query('begin')

    try {
        let result = await client.query(
            `select * from group_users
            where group_id = $1
            order by bans desc
            limit 3`,
            [chatId]
        )

        const bans: GroupUser[] = result.rows

        result = await client.query(
            `select * from group_users
            where group_id = $1
            order by respects desc
            limit 3`,
            [chatId]
        )

        const respects: GroupUser[] = result.rows

        let { rows: sumResult } = await client.query(
            `select 
                group_id, sum(respects)::int as respects, sum(bans)::int as bans
            from
                group_users
            where
                group_id = $1
            group by group_id`,
            [chatId]
        )

        await client.query('commit')
        client.release()

        return {
            bans,
            respects,
            respectsSum: sumResult[0].respects,
            bansSum: sumResult[0].bans
        }
    } catch (e) {
        await client.query('rollback')
        client.release()

        console.log(e)

        return null
    }
}

const updateUserNameInfo = async (userId: number, options?: { chatId: number, name: string }): Promise<boolean> => {
    const client = await pool.connect()
    await client.query('begin')

    try {
        if (options) {
            await client.query(
                `update group_users
                set 
                    user_name = $3
                where 
                    user_id = $1 and
                    group_id = $2`,
                [userId, options.chatId, options.name]
            )

            await client.query('commit')
            client.release()

            return true
        } else {
            const userInfo = await vk.api.users.get({ user_ids: [userId.toString()] })

            if (userInfo.length > 0) {
                await client.query(
                    `update group_users
                    set user_name = $2
                    where user_id = $1`,
                    [userId, userInfo[0].first_name]
                )

                await client.query('commit')
                client.release()

                return true
            }
            return false
        }
    } catch (e) {
        await client.query('rollback')
        client.release()

        console.error(e)

        return false
    }
}

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
            returning bans, user_name`,
            [chatId, userId]
        )

        await client.query('commit')
        client.release()

        if (result.rows[0].user_name === null) updateUserNameInfo(userId)

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
    getStats,
    updateUserNameInfo,
    addBan,
    addRespect
}