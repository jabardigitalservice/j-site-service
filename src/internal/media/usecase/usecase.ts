import winston from 'winston'
import S3 from '../../../external/s3'
import { Meta, PropPaginate } from '../../../helpers/paginate'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import { Store } from '../entity/interface'
import Repository from '../repository/mongo/repository'

class Usecase {
    constructor(
        private repository: Repository,
        private logger: winston.Logger,
        private s3: S3
    ) {}

    public async Store(body: Store, database: string) {
        await this.s3.Upload(body.file.source as string, body.file.path)
        delete body.file.source
        const result = await this.repository.Store(body, database)
        return result
    }

    public async Show(id: string, database: string) {
        const item = await this.repository.FindById(id, database)

        if (!item)
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )

        return item
    }

    public async FindAll(prop: PropPaginate, database: string) {
        const data = await this.repository.FindAll(prop, database)
        const count = await this.repository.GetCount(database)

        return { data, meta: Meta(prop, count) }
    }
}

export default Usecase
