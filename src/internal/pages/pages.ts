import winston from 'winston'
import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import { VerifyAuth } from '../../transport/http/middleware/verifyAuth'
import {
    VerifySettingBySubDomain,
    VerifySettingById,
} from '../../transport/http/middleware/verifySetting'
import Handler from './delivery/http/handler'
import Repository from './repository/mongo/repository'
import Usecase from './usecase/usecase'

class Pages {
    constructor(
        private http: Http,
        private logger: winston.Logger,
        private config: Config
    ) {
        const repository = new Repository(logger)
        const usecase = new Usecase(repository, logger)
        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(usecase, this.logger, this.http)
        this.httpPublic(handler)
        this.httpCms(handler)
    }

    private httpPublic(handler: Handler) {
        const verifySettingBySubDomain = VerifySettingBySubDomain(this.config.db.name)
        const Router = this.http.Router()

        Router.get('/:slug', handler.FindBySlug())

        this.http.SetRouter('/v1/public/pages/', verifySettingBySubDomain, Router)
    }

    private httpCms(handler: Handler) {
        const verifyAuth = VerifyAuth(this.config.jwt.access_key)
        const verifySettingById = VerifySettingById(this.config.db.name)
        const Router = this.http.Router()

        Router.post('/', handler.Store())
        Router.get('/', handler.FindAll())
        Router.get('/:idPage', handler.Show())

        this.http.SetRouter(
            '/v1/pages/:idSetting/',
            verifyAuth,
            verifySettingById,
            Router
        )
    }
}

export default Pages
