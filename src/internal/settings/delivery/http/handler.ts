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
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const value = ValidateFormRequest(Store, req.body)

                const result = await this.usecase.Store(value)
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
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const idSetting = ValidateObjectId(
                    req.params.idSetting,
                    'idSetting'
                )

                const result = await this.usecase.Show(idSetting)
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
                const paginate = Paginate(req.query)
                const { data, meta } = await this.usecase.FindAll(paginate)
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
