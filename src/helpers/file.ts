import path from 'path'

export const CustomPathFile = (
    env: string,
    id: string,
    category: string,
    file: Express.Multer.File
) => {
    const ext = path.extname(file.originalname)
    return `${env}/${id}/${category}/${file.filename}${ext}`
}
