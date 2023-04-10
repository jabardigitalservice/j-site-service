import Joi from 'joi'

export const Store = Joi.object({
    content: Joi.string().required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    category: Joi.string().required(),
    image: Joi.string().required(),
    tags: Joi.array().items(Joi.string().required()).min(1),
    is_pinned: Joi.boolean().required(),
})
