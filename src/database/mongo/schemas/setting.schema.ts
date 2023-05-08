import { Schema } from 'mongoose'
import config from '../../../config/config'
import { Translate } from '../../../helpers/translate'
import Mongo from '../mongo'

const schema = new Schema(
    {
        created_by: {
            type: String,
            required: false,
            index: true,
        },
        name: {
            type: String,
            required: true,
            index: true,
        },
        published_by: {
            type: String,
            required: false,
            index: true,
        },
        favicon: {
            type: String,
            default: null,
        },
        color_palatte: {
            type: String,
            required: true,
        },
        subdomain: {
            type: String,
            required: true,
            index: true,
        },
        organization: {
            type: String,
            required: true,
            index: true,
        },
        published_at: Date,
        status: {
            type: String,
            index: true,
        },
        is_active: {
            type: Boolean,
            index: true,
        },
        logo: {
            type: String,
            required: true,
        },
        navigation: {
            type: Object,
            default: null,
        },
        footer: {
            type: Object,
            default: null,
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

schema.virtual('domain').get(function () {
    return Translate('domain', {
        subdomain: this.subdomain,
        domain: config.domain.base_url,
    })
})

export default (database: string) => {
    return Mongo.Model(database, 'settings', schema)
}
