import Joi from 'joi'

export default Joi.object({
    APP_NAME: Joi.string().required(),
    APP_ENV: Joi.string()
        .valid('local', 'staging', 'production')
        .default('local'),
    APP_PORT_HTTP: Joi.number().required(),
    APP_LOG: Joi.string().valid('info', 'error', 'warn').required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_AUTH_SOURCE: Joi.string().optional(),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_ALGORITHM: Joi.string().default('HS256'),
    ELASTIC_CLOUD_ID: Joi.string().optional().allow(''),
    ELASTIC_API_KEY: Joi.string().optional().allow(''),
    REDIS_HOST: Joi.string().optional(),
    REDIS_PORT: Joi.number().optional(),
    REDIS_TTL: Joi.number().optional(),
    FILE_TYPE: Joi.string()
        .optional()
        .default(
            'image/jpg,image/png,image/jpeg,application/pdf,image/svg+xml'
        ),
    FILE_MAX: Joi.number().optional().default(10),
    FILE_URI: Joi.string().uri().optional(),
    AWS_ACCESS_KEY_ID: Joi.string().optional(),
    AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
    AWS_BUCKET: Joi.string().optional(),
    AWS_REGION: Joi.string().optional(),
    AWS_HOSTED_ZONE_ID: Joi.string().optional(),
    AWS_RECORD_TYPE: Joi.string().optional(),
    AWS_RESOURCE_RECORD_VALUE: Joi.string().optional(),
    AWS_RESOURCE_RECORD_TTL: Joi.number().optional(),
    DOMAIN_BASE_URL: Joi.string().optional(),
})
