import { RegexWordScript } from "./regex"

describe('test all in file regex', () => {
    it('test regex Word Script to replace on word `script`', () => {
        const content = '<script></script>'
        const contentReplaced = content.replace(RegexWordScript, '')

        expect(contentReplaced).toEqual('<></>')
    })
})