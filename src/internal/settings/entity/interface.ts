export interface Store {
    organization: string
    subdomain: string
    favicon: string
    title: string
    logo: string
    color_palatte: string
    name: string
    created_by: string
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
