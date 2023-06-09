import { Schema } from 'mongoose'
import slugify from '../../../pkg/slug'
import Mongo from '../mongo'
import config from '../../../config/config'

const schema = new Schema(
    {
        created_by: {
            type: String,
            required: false,
            index: true,
        },
        title: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        slug: {
            type: String,
            index: true,
        },
        sections: {
            type: Object,
            required: true,
        },
        is_active: {
            type: Boolean,
            index: true,
        },
        banner: {
            type: String,
            default: null,
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

schema.pre('save', function (next) {
    this.slug = slugify(this.title + ' ' + this.id)
    next()
})

schema.virtual('banner_uri').get(function () {
    return `${config.file.uri}${this.banner}`
})

export default (database: string) => {
    return Mongo.Model(database, 'pages', schema)
}
