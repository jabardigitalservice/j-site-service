import config from './config/config'
import Mongo from './database/mongo/mongo'
import Media from './internal/media/media'
import Pages from './internal/pages/pages'
import Posts from './internal/posts/posts'
import Settings from './internal/settings/settings'
import Logger from './pkg/logger'
import Redis from './pkg/redis'
import Http from './transport/http/http'

const main = async () => {
    const { logger } = new Logger(config)
    await Mongo.Connect(logger, config)
    const redis = new Redis(config, logger)
    const http = new Http(logger, config)

    // Load internal apps
    new Pages(http, logger, config)
    new Settings(http, logger, config)
    new Posts(http, logger, config)
    new Media(http, logger, config)

    http.Run(config.app.port.http)

    return {
        http,
    }
}

export default main()
