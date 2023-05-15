import path from 'path'

export const CustomPathFile = (unit: string, values: any) => {
    const { file, category } = values
    const ext = path.extname(file.originalname)
    return `/${unit}/${category}/${file.filename}${ext}`
}
