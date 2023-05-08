import winston from 'winston'
import { status } from '../../../../database/constant/setting'
import Setting from '../../../../database/mongo/schemas/setting.schema'
import { RemoveProcotol } from '../../../../helpers/http'
import { PropPaginate } from '../../../../helpers/paginate'
import { IUser } from '../../../../transport/http/middleware/verifyAuth'
import { Store, UpdateNavigation } from '../../entity/interface'

class Repository {
    private setting
    constructor(private logger: winston.Logger, private database: string) {
        this.setting = Setting(database)
    }

    public async Store(body: Store) {
        const settingNew = new this.setting({
            ...body,
            status: status.DRAFT,
            is_active: false,
        })

        return settingNew.save()
    }

    public async FindBySubdomain(subdomain: string) {
        return this.setting.findOne({ subdomain })
    }

    public async FindByID(id: string) {
        return this.setting.findById(id)
    }

    private filterByUser(user: IUser) {
        return {
            organization: user.unit.name,
        }
    }

    public async FindAll({ limit, offset }: PropPaginate, user: IUser) {
        const filter = this.filterByUser(user)
        return this.setting.find(filter).skip(offset).limit(limit)
    }

    public async GetCount(user: IUser) {
        const filter = this.filterByUser(user)
        return this.setting.find(filter).count()
    }

    public async UpdateNavigation(id: string, body: UpdateNavigation) {
        return this.setting.findByIdAndUpdate(id, {
            navigation: body,
            updated_at: new Date(),
        })
    }
}

export default Repository
