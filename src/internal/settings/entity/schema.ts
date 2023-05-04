import Joi from 'joi'

export const Store = Joi.object({
    domain: Joi.string().uri().required(),
    favicon: Joi.string().uri().required(),
    logo: Joi.string().uri().required(),
    color_palatte: Joi.string().required(),
    name: Joi.string().required(),
})
