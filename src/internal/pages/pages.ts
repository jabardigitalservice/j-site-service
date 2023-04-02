import winston from 'winston'
import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import { VerifyAuth } from '../../transport/http/middleware/verifyAuth'
import {
    VerifySettingByDomain,
    VerifySettingById,
} from '../../transport/http/middleware/verifySetting'
import HttpHandler from './delivery/http/handler'
import Repository from './repository/mongo/repository'
import Usecase from './usecase/usecase'

class Pages {
    private httpHandler: HttpHandler
    constructor(
        private http: Http,
        private logger: winston.Logger,
        private config: Config
    ) {
        const repository = new Repository(logger)
        const usecase = new Usecase(repository, logger)
        this.httpHandler = new HttpHandler(usecase, this.logger, http)
        this.loadHttp()
    }

    private loadHttp() {
        this.httpPublic()
        this.httpCms()
    }

    private httpPublic() {
        const verifySettingByDomain = VerifySettingByDomain(this.config.db.name)
        const Router = this.http.Router()

        Router.get('/pages/:slug', this.httpHandler.FindBySlug())

        this.http.SetRouter('/v1/public/', verifySettingByDomain, Router)
    }

    private httpCms() {
        const verifyAuth = VerifyAuth(this.config.jwt.access_key)
        const verifySettingById = VerifySettingById(this.config.db.name)
        const Router = this.http.Router()

        Router.post('/:idSetting', this.httpHandler.Store())
        Router.get('/:idSetting', this.httpHandler.FindAll())
        Router.get('/:idSetting/:idPage', this.httpHandler.Show())

        this.http.SetRouter('/v1/pages/', verifyAuth, verifySettingById, Router)
    }
}

export default Pages
