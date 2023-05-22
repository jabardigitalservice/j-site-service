import Joi from 'joi'

export const Store = Joi.object({
    subdomain: Joi.string().required(),
    favicon: Joi.string().required(),
    logo: Joi.string().required(),
    name: Joi.string().required(),
})

export const UpdateNavigation = Joi.object({
    home: Joi.string().required(),
    menus: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                link: Joi.string().uri().optional().allow(null).default(null),
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

export const UpdateFooter = Joi.object({
    manager_name: Joi.string().required(),
    address: Joi.string().required(),
    phone_number: Joi.string().required(),
    email: Joi.string().email().required(),
    copyright: Joi.string().required(),
    social_media: Joi.object({
        facebook: Joi.string().uri().optional().default(null),
        instagram: Joi.string().uri().optional().default(null),
        twitter: Joi.string().uri().optional().default(null),
        youtube: Joi.string().uri().optional().default(null),
        email: Joi.string().uri().optional().default(null),
    }).required(),
})

export const UpdateTheme = Joi.object({
    color_palette: Joi.string().required(),
})
