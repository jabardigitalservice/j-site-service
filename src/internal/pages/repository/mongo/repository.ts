import winston from 'winston'
import Page from '../../../../database/mongo/schemas/page.schema'
import { PropPaginate } from '../../../../helpers/paginate'
import { Store } from '../../entity/interface'

class Repository {
    private schema = Page
    constructor(private logger: winston.Logger) {}

    public async Store(body: Store, database: string) {
        const schema = this.schema(database)
        const schemaNew = new schema(body)

        return schemaNew.save()
    }

    public async FindByTitle(title: string, database: string) {
        const schema = this.schema(database)
        return schema.findOne({ title })
    }

    public async FindById(id: string, database: string) {
        const schema = this.schema(database)
        return schema.findById(id)
    }

    public async FindBySlug(slug: string, database: string) {
        const schema = this.schema(database)
        return schema.findOne({
            slug,
        })
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
