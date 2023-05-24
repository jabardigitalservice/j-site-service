import winston from 'winston'
import { Meta, PropPaginate } from '../../../helpers/paginate'
import { Translate } from '../../../helpers/translate'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import { IUser } from '../../../transport/http/middleware/verifyAuth'
import {
    Store,
    UpdateFooter,
    UpdateNavigation,
    UpdateTheme,
} from '../entity/interface'
import Repository from '../repository/mongo/repository'
import Route53 from '../../../external/route53'

class Usecase {
    constructor(
        private repository: Repository,
        private logger: winston.Logger,
        private route53: Route53
    ) {}

    public async Store(body: Store, user: IUser) {
        const testDNSAnswer = await this.route53.TestDNSAnswer(body.subdomain)
        const item = await this.repository.FindBySubdomain(body.subdomain)

        if (testDNSAnswer || item)
            throw new error(
                statusCode.BAD_REQUEST,
                Translate('exists', { attribute: 'subdomain' })
            )

        const result = await this.repository.Store(body, user)
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

    public async UpdateFooter(id: string, body: UpdateFooter) {
        const item = await this.repository.FindByID(id)

        if (!item)
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )

        const result = await this.repository.UpdateFooter(id, body)
        return result
    }

    public async UpdateTheme(id: string, body: UpdateTheme) {
        const item = await this.repository.FindByID(id)

        if (!item)
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )

        const result = await this.repository.UpdateTheme(id, body)
        return result
    }

    public async Destroy(id: string) {
        const item = await this.repository.FindByID(id)

        if (!item)
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )

        const result = await this.repository.Destroy(id)
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
