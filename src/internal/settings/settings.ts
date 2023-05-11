import winston from 'winston'
import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import { VerifyAuth } from '../../transport/http/middleware/verifyAuth'
import Handler from './delivery/http/handler'
import Repository from './repository/mongo/repository'
import Usecase from './usecase/usecase'

class Settings {
    constructor(
        private http: Http,
        private logger: winston.Logger,
        private config: Config
    ) {
        const repository = new Repository(logger, config.db.name)
        const usecase = new Usecase(repository, logger)

        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(usecase, this.logger, this.http)
        const verify = VerifyAuth(this.config.jwt.access_key)

        const Router = this.http.Router()

        Router.post('/', handler.Store())
        Router.get('/', handler.FindAll())
        Router.get('/:idSetting', handler.Show())
        Router.patch('/:idSetting/navigation', handler.UpdateNavigation())
        Router.patch('/:idSetting/footer', handler.UpdateFooter())
        Router.delete('/:idSetting', handler.Destroy())

        this.http.SetRouter('/v1/settings/', verify, Router)
    }
}

export default Settings
