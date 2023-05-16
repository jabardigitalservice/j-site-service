import winston from 'winston'
import { status } from '../../../../database/constant/setting'
import Mongo from '../../../../database/mongo/mongo'
import Setting from '../../../../database/mongo/schemas/setting.schema'
import { PropPaginate } from '../../../../helpers/paginate'
import { IUser } from '../../../../transport/http/middleware/verifyAuth'
import {
    Store,
    UpdateFooter,
    UpdateNavigation,
    UpdateTheme,
} from '../../entity/interface'

class Repository {
    private setting
    constructor(private logger: winston.Logger, private database: string) {
        this.setting = Setting(database)
    }

    public async Store(body: Store, user: IUser) {
        const settingNew = new this.setting({
            ...body,
            created_by: user.id,
            organization: user.unit.name,
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

    public async UpdateFooter(id: string, body: UpdateFooter) {
        return this.setting.findByIdAndUpdate(id, {
            footer: body,
            updated_at: new Date(),
        })
    }

    public async UpdateTheme(id: string, body: UpdateTheme) {
        return this.setting.findByIdAndUpdate(id, {
            body,
            updated_at: new Date(),
        })
    }

    public async Destroy(id: string) {
        await Mongo.DropDatabase(id)
        return this.setting.findByIdAndDelete(id)
    }
}

export default Repository
