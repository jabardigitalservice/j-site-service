export interface Store {
    file: {
        path: string
        size: number
        mimetype: string
        originalname: string
        filename: string
        source?: string
    }
    caption: string
    title: string
    description: string
    category: string
    tags: string[]
}
