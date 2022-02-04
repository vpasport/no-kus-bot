import { config } from '../../config'
import { Pool } from 'pg'

let pool: Pool | null = null


const getPool = (): Pool => {
    if (!pool) pool = new Pool({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name
    })

    return pool
}

export {
    getPool
}