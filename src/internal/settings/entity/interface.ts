export interface Store {
    subdomain: string
    favicon: string
    logo: string
    name: string
}

export interface UpdateFooter {
    manager_name: string
    address: string
    phone_number: string
    email: string
    copyright: string
    social_media: {
        facebook: string
        instagram: string
        twitter: string
        youtube: string
        email: string
    }
}

export interface UpdateTheme {
    color_palette: string
}

export interface UpdateNavigation {
    home: string
    menus: Menu[]
}

interface Menu {
    name: string
    link: string
    children: Children[]
}

interface Children {
    name: string
    to: string
    slug: string
}
