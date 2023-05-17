import winston from 'winston'
import { PropPaginate } from '../../../../helpers/paginate'
import { Store } from '../../entity/interface'
import Media from '../../../../database/mongo/schemas/media.schema'

class Repository {
    private media
    constructor(private logger: winston.Logger, database: string) {
        this.media = Media(database)
    }

    public async Store(body: Store) {
        const schemaNew = new this.media(body)

        return schemaNew.save()
    }

    public async FindById(id: string) {
        return this.media.findById(id)
    }

    public async FindAll({ offset, limit }: PropPaginate) {
        return this.media.find().skip(offset).limit(limit)
    }

    public async GetCount() {
        return this.media.count()
    }
}

export default Repository
