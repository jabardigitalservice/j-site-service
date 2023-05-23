import { Config } from '../config/config.interface'
import error from '../pkg/error'
import { Route53Client, TestDNSAnswerCommand } from "@aws-sdk/client-route-53";

/**
 * Reference for command 
 * https://docs.aws.amazon.com/cli/latest/reference/route53/index.html
 */

class Route53 {
    private client
    constructor(private config: Config) {
        this.client = new Route53Client({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.access_key_id,
                secretAccessKey: config.aws.secret_access_key,
            },
        })
    }

    public async TestDNSAnswer(recordName: string) {
        try {
            const command = new TestDNSAnswerCommand({
                HostedZoneId: this.config.aws.hosted_zone_id,
                RecordName: recordName,
                RecordType: this.config.aws.record_type
            })
            const result = await this.client.send(command)
            return !!result.RecordData?.length
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'Route53: ' + err.message)
        }
    }
}

export default Route53
