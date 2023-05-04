import winston from 'winston'
import { Meta, PropPaginate } from '../../../helpers/paginate'
import { Translate } from '../../../helpers/translate'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import { IUser } from '../../../transport/http/middleware/verifyAuth'
import { Store, UpdateNavigation } from '../entity/interface'
import Repository from '../repository/mongo/repository'

class Usecase {
    constructor(
        private repository: Repository,
        private logger: winston.Logger
    ) {}

    public async Store(body: Store) {
        const isExist = await this.repository.FindByDomain(body.domain)

        if (isExist)
            throw new error(
                statusCode.BAD_REQUEST,
                Translate('exists', { attribute: 'domain' })
            )

        const result = await this.repository.Store(body)
        return result
    }

    public async UpdateNavigation(id: string, body: UpdateNavigation) {
        const item = await this.repository.FindByID(id)

        if (!item)
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )

        const result = await this.repository.UpdateNavigation(id, body)
        return result
    }

    public async Show(id: string) {
        const item = await this.repository.FindByID(id)

        if (!item)
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )

        return item
    }

    public async FindAll(prop: PropPaginate, user: IUser) {
        const data = await this.repository.FindAll(prop, user)
        const count = await this.repository.GetCount(user)

        return { data, meta: Meta(prop, count) }
    }
}

export default Usecase
