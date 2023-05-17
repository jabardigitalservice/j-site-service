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

    public async Store(body: Store) {
        await this.s3.Upload(body.file.source as string, body.file.path)
        delete body.file.source
        const result = await this.repository.Store(body)
        return result
    }

    public async Show(id: string) {
        const item = await this.repository.FindById(id)

        if (!item)
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )

        return item
    }

    public async FindAll(prop: PropPaginate) {
        const data = await this.repository.FindAll(prop)
        const count = await this.repository.GetCount()

        return { data, meta: Meta(prop, count) }
    }
}

export default Usecase
