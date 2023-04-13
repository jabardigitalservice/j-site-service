import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import Error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'

export const VerifyAuth = (
    secretOrPublicKey: jwt.Secret,
    options?: jwt.VerifyOptions
) => {
    return (req: any, res: Response, next: NextFunction) => {
        const { authorization } = req.headers

        if (!authorization) {
            return next(
                new Error(
                    statusCode.UNAUTHORIZED,
                    statusCode[statusCode.UNAUTHORIZED]
                )
            )
        }

        const [_, token] = authorization.split('Bearer ')

        try {
            const decoded = jwt.verify(token, secretOrPublicKey, options)
            req['user'] = decoded
            return next()
        } catch (err) {
            return next(
                new Error(
                    statusCode.UNAUTHORIZED,
                    statusCode[statusCode.UNAUTHORIZED]
                )
            )
        }
    }
}

export interface IUser {
    id: string
    name: string
    email: string
    unit: {
        id: number
        name: string
        chief: string
        address: string
        website: string
        ppid: string
        logo: string
        phone: string
    }
    role: {
        id: number
        name: string
    }
    permissions: Array<string>
    exp: number
    iss: string
}
