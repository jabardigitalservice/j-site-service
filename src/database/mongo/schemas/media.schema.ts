import { Schema } from 'mongoose'
import config from '../../../config/config'
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
            required: true,
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
            type: [String],
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
    }
)

schema.virtual('file.uri').get(function () {
    if (this.file) {
        return `${config.file.uri}/${this.file.path}`
    }
})

export default (database: string) => {
    return Mongo.Model(database, 'media', schema)
}
