import path from 'path'

export const CustomPathFile = (env: string, id: string, values: any) => {
    const { file, category } = values
    const ext = path.extname(file.originalname)
    return `${env}/${id}/${category}/${file.filename}${ext}`
}
