import { CustomPathFile } from './file'

describe('test all function in file', () => {
    it('test function CustomPathFile', () => {
        const path = CustomPathFile('superadmin', {
            file: {
                originalname: 'test.png',
                filename: 'newNameFile',
            },
            category: 'test',
        })

        expect(path).toEqual('superadmin/test/newNameFile.png')
    })
})
