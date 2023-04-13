import { Schema } from 'mongoose'
import Mongo from '../mongo'
import { status } from '../../constant/setting'
import { excerpt } from '../../constant/post'
import slugify from 'slugify'

const schema = new Schema(
    {
        created_by: {
            type: String,
            required: false,
            index: true,
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: String,
        title: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        author: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            index: true,
        },
        published_at: Date,
        views: {
            type: Number,
            default: 0,
            index: true,
        },
        shared: {
            type: Number,
            index: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
            index: true,
        },
        image: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: status.DRAFT,
            required: true,
        },
        tags: {
            type: Array,
            default: [],
            required: false,
        },
        is_pinned: {
            type: Boolean,
            default: false,
            required: false,
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
    this.excerpt = this.content.substring(0, excerpt.maxLength)
    next()
})

export default (database: string) => {
    return Mongo.Model(database, 'posts', schema)
}
