import Joi from 'joi'

export const Store = Joi.object({
    domain: Joi.string().required(),
    favicon: Joi.string().uri().optional().default(null),
    logo: Joi.string().uri().required(),
    color_palatte: Joi.string().required(),
    name: Joi.string().required(),
})
