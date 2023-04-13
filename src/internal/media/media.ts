import winston from 'winston'
import { Config } from '../../config/config.interface'
import S3 from '../../external/s3'
import Http from '../../transport/http/http'
import { VerifyAuth } from '../../transport/http/middleware/verifyAuth'
import { VerifySettingById } from '../../transport/http/middleware/verifySetting'
import Handler from './delivery/http/handler'
import Repository from './repository/mongo/repository'
import Usecase from './usecase/usecase'

class Media {
    constructor(
        private http: Http,
        private logger: winston.Logger,
        private config: Config
    ) {
        const s3 = new S3(config)
        const repository = new Repository(logger)
        const usecase = new Usecase(repository, logger, s3)
        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(usecase, this.logger, this.http)
        this.httpPublic(handler)
        this.httpCms(handler)
    }

    private httpPublic(handler: Handler) {}

    private httpCms(handler: Handler) {
        const verifyAuth = VerifyAuth(this.config.jwt.access_key)
        const verifySettingById = VerifySettingById(this.config.db.name)
        const Router = this.http.Router()

        Router.post('/', this.http.Upload('file'), handler.Store())
        Router.get('/', handler.FindAll())
        Router.get('/:idMedia', handler.Show())

        this.http.SetRouter(
            '/v1/media/:idSetting/',
            verifyAuth,
            verifySettingById,
            Router
        )
    }
}

export default Media
