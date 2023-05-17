import mongoose, { Schema } from 'mongoose'
import winston from 'winston'
import { Config } from '../../config/config.interface'
import { RemoveProcotol } from '../../helpers/http'
import Setting from './schemas/setting.schema'

class Mongo {
    public static async Connect(logger: winston.Logger, { db }: Config) {
        mongoose.set('strictQuery', false)
        return mongoose
            .connect(`mongodb://${db.host}:${db.port}/${db.name}`, {
                authSource: db.auth_source,
                pass: db.password,
                user: db.username,
                retryWrites: true,
                writeConcern: { w: 'majority' },
            })
            .then(() => {
                logger.info('Connection to database established')
            })
            .catch((e) => {
                logger.error(e.message)
                process.exit(-1)
            })
    }

    public static Model(database: string, collection: string, schema: Schema) {
        return mongoose.connection
            .useDb(database, {
                useCache: true,
            })
            .model(collection, schema)
    }

    public static FindByIdSetting(database: string, id: string) {
        const setting = Setting(database)

        return setting.findById(id)
    }

    public static FindBySubDomainSetting(database: string, domain: string) {
        const setting = Setting(database)
        let subdomain = RemoveProcotol(domain)
        subdomain = subdomain.split('.')[0]

        return setting.findOne({
            subdomain,
        })
    }

    public static DropDatabase(dbName: string) {
        return mongoose.connection.db.dropDatabase({
            dbName,
        })
    }
}

export default Mongo
