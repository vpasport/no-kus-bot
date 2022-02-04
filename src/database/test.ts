import { getPool } from './pg'

const pool = getPool()

const test = async () => {
    const client = await pool.connect()
    await client.query('begin')

    try {
        const result = await client.query(
            `select
                *
            from
                group_users`
        )
        console.log(result.rows)

        await client.query('commit')
        client.release()
    } catch (e) {
        await client.query('rollback')
        client.release()
        console.error(e)
    }
}

export {
    test
}