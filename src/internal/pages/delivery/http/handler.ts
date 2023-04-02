import { NextFunction, Request, Response } from 'express'
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

class Handler {
    constructor(
        private usecase: Usecase,
        private logger: winston.Logger,
        private http: Http
    ) {}
    public Store() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const value = ValidateFormRequest(Store, req.body)
                const setting = req.setting
                const result = await this.usecase.Store(value, setting.id)
                this.logger.info(statusCode[statusCode.CREATED], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.CREATED
                    ),
                })
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
                const idPage = ValidateObjectId(req.params.idPage, 'idPage')
                const setting = req.setting
                const result = await this.usecase.Show(idPage, setting.id)
                this.logger.info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })
                return res.json({
                    data: {
                        setting,
                        page: result,
                    },
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
    public FindBySlug() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const setting = req.setting
                const result = await this.usecase.FindBySlug(
                    req.params.slug,
                    setting.id
                )
                this.logger.info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })
                return res.json({
                    data: {
                        setting,
                        page: result,
                    },
                })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
