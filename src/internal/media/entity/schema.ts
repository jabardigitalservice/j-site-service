import Joi from 'joi'
import config from '../../../config/config'

export const Store = Joi.object({
    caption: Joi.string().optional().default(null),
    category: Joi.string().required(),
    tags: Joi.array().items(Joi.string().optional()).min(0),
    title: Joi.string().optional().default(null),
    description: Joi.string().optional().default(null),
    file: Joi.object({
        path: Joi.string().required(),
        size: Joi.number().max(config.file.max).required(),
        mimetype: Joi.string()
            .valid(...config.file.type)
            .required(),
        originalname: Joi.string().required(),
        filename: Joi.string().required(),
    }),
})
