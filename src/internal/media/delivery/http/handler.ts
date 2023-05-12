import { NextFunction, Response } from 'express'
import winston from 'winston'
import Usecase from '../../usecase/usecase'
import { Store } from '../../entity/schema'
import {
    ValidateFormRequest,
    ValidateObjectId,
} from '../../../../helpers/validate'
import statusCode from '../../../../pkg/statusCode'
import { Paginate } from '../../../../helpers/paginate'
import Http from '../../../../transport/http/http'
import { unlinkSync } from 'fs'
import { CustomPathFile } from '../../../../helpers/file'
import { IUser } from '../../../../transport/http/middleware/verifyAuth'
import { Config } from '../../../../config/config.interface'
import slugify from 'slugify'

class Handler {
    constructor(
        private usecase: Usecase,
        private logger: winston.Logger,
        private http: Http,
        private config: Config
    ) {}

    private getDataFormRequest = (req: any) => {
        const user = req.user as IUser
        return {
            ...ValidateFormRequest(Store, {
                caption: req.body.caption,
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                tags: req.body.tags,
                file: req.file || {},
            }),
            organization: user.unit.name,
            created_by: user.id,
        }
    }

    public Store() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const user = req.user as IUser
                const value = this.getDataFormRequest(req)
                value.file.source = value.file.path
                const slugFromUnitName = slugify(user.unit.name).toLowerCase()
                value.file.path = CustomPathFile(slugFromUnitName, value)

                const result = await this.usecase.Store(
                    value,
                    this.config.db.name
                )
                this.logger.info(statusCode[statusCode.CREATED], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.CREATED
                    ),
                })

                unlinkSync(this.http.dest + '/' + value.file.filename)
                return res
                    .status(statusCode.CREATED)
                    .json({ data: result.toJSON(), message: 'CREATED' })
            } catch (error) {
                return next(error)
            }
        }
    }
    public Show() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const id = ValidateObjectId(req.params.idMedia, 'idMedia')
                const setting = req.setting
                const result = await this.usecase.Show(id, setting.id)
                this.logger.info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })
                return res.json({
                    data: result,
                })
            } catch (error) {
                return next(error)
            }
        }
    }
    public FindAll() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const setting = req.setting
                const paginate = Paginate(req.query)
                const { data, meta } = await this.usecase.FindAll(
                    paginate,
                    setting.id
                )
                this.logger.info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })
                return res.json({
                    data,
                    meta,
                })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
