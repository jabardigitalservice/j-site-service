import path from 'path'

export const CustomPathFile = (id: string, values: any) => {
    const { file, category } = values
    const ext = path.extname(file.originalname)
    return `${id}/${category}/${file.filename}${ext}`
}

export const FullUriFile = (fileAccessPublic: string, path: string) => {
    return `${fileAccessPublic}/${path}`
}
