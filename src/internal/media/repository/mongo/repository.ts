import winston from 'winston'
import mediaSchema from '../../../../database/mongo/schemas/media.schema'
import { PropPaginate } from '../../../../helpers/paginate'
import { Store } from '../../entity/interface'

class Repository {
    private schema = mediaSchema
    constructor(private logger: winston.Logger) {}

    public async Store(body: Store, database: string) {
        const schema = this.schema(database)
        const schemaNew = new schema(body)

        return schemaNew.save()
    }

    public async FindById(id: string, database: string) {
        const schema = this.schema(database)
        return schema.findById(id)
    }

    public async FindAll({ offset, limit }: PropPaginate, database: string) {
        const schema = this.schema(database)
        return schema.find().skip(offset).limit(limit)
    }

    public async GetCount(database: string) {
        const schema = this.schema(database)
        return schema.count()
    }
}

export default Repository
