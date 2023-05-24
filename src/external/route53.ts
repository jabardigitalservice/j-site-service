import { Config } from '../config/config.interface'
import { GetDomain } from '../helpers/http'
import error from '../pkg/error'
import {
    ChangeAction,
    ChangeResourceRecordSetsCommand,
    Route53Client,
    TestDNSAnswerCommand,
} from '@aws-sdk/client-route-53'

/**
 * Reference for list command
 * https://docs.aws.amazon.com/cli/latest/reference/route53/index.html
 */

class Route53 {
    private client
    private domain
    private recordType
    private hostedZoneId
    private resourceRecordValue
    private resourceRecordTTL
    constructor(private config: Config) {
        this.client = new Route53Client({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.access_key_id,
                secretAccessKey: config.aws.secret_access_key,
            },
        })
        this.domain = config.domain.base_url
        const {
            record_type,
            hosted_zone_id,
            resource_record_value,
            resource_record_ttl,
        } = config.aws

        this.recordType = record_type
        this.hostedZoneId = hosted_zone_id
        this.resourceRecordValue = resource_record_value
        this.resourceRecordTTL = resource_record_ttl
    }

    public async TestDNSAnswer(subdomain: string) {
        try {
            const command = new TestDNSAnswerCommand({
                HostedZoneId: this.hostedZoneId,
                RecordName: GetDomain(subdomain, this.domain),
                RecordType: this.recordType,
            })
            const result = await this.client.send(command)
            return !!result.RecordData?.length
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'Route53: ' + err.message)
        }
    }

    public async ChangeResourceRecordsSetsRequest(subdomain: string) {
        try {
            const command = new ChangeResourceRecordSetsCommand({
                HostedZoneId: this.hostedZoneId,
                ChangeBatch: {
                    Changes: [
                        {
                            Action: ChangeAction.UPSERT,
                            ResourceRecordSet: {
                                Name: GetDomain(subdomain, this.domain),
                                Type: this.recordType,
                                TTL: this.resourceRecordTTL,
                                ResourceRecords: [
                                    { Value: this.resourceRecordValue },
                                ],
                            },
                        },
                    ],
                },
            })
            const result = await this.client.send(command)
            return result.ChangeInfo
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'Route53: ' + err.message)
        }
    }
}

export default Route53
