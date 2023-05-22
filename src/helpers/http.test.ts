import { RemoveProcotol } from './http'

describe('test all function in file http', () => {
    it('test a function Remove Protocol', () => {
        const url = RemoveProcotol('http://localhost:3000')
        expect(url).toEqual('localhost:3000')
    })
})
