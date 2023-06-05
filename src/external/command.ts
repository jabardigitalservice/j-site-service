import { exec } from 'child_process'
import { Config } from '../config/config.interface'
import { GetDomain } from '../helpers/http'

class Command {
    private domain

    constructor(config: Config) {
        this.domain = config.domain.base_url
    }

    CheckAvailableDNS(subdomain: string) {
        return new Promise((resolve, _) => {
            exec(`host ${GetDomain(subdomain, this.domain)}`, (err) => {
                if (err) return resolve(false)
                resolve(true)
            })
        })
    }
}

export default Command
