import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { readFileSync } from 'fs'
import { Config } from '../config/config.interface'
import error from '../pkg/error'

class S3 {
    private s3: S3Client
    constructor(private config: Config) {
        this.s3 = new S3Client({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.access_key_id,
                secretAccessKey: config.aws.secret_access_key,
            },
        })
    }

    public async Upload(source: string, path: string) {
        try {
            const params = {
                Bucket: this.config.aws.bucket,
                Key: path,
                Body: readFileSync(source),
            }
            const command = new PutObjectCommand(params)
            const result = await this.s3.send(command)

            return result
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'cloud storage: ' + err.message)
        }
    }

    public async Delete(path: string) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.config.aws.bucket,
                Key: path,
            })
            const result = await this.s3.send(command)
            return result
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'cloud storage: ' + err.message)
        }
    }
}

export default S3
