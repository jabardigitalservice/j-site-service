import { Schema } from 'mongoose'
import Mongo from '../mongo'

const schema = new Schema(
    {
        created_by: {
            type: String,
            required: false,
            index: true,
        },
        file: {
            type: Object,
            required: true
        },
        caption: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        tags: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        versionKey: false,
    }
)

export default (database: string) => {
    return Mongo.Model(database, 'media', schema)
}
