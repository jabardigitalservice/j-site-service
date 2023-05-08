import Joi from 'joi'

export const Store = Joi.object({
    subdomain: Joi.string().required(),
    favicon: Joi.string().uri().required(),
    logo: Joi.string().uri().required(),
    color_palatte: Joi.string().required(),
    name: Joi.string().required(),
})

export const UpdateNavigation = Joi.object({
    home: Joi.string().required(),
    menus: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                link: Joi.string().uri().optional().allow(null, ''),
                children: Joi.array().items(
                    Joi.object({
                        name: Joi.string().required(),
                        to: Joi.string().required(),
                        slug: Joi.string().required(),
                    })
                ),
            })
        )
        .required(),
})
