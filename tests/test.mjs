import { homedir } from 'os'
import { LLAMACPP } from '../build/LLAMACPP.js'
import { join } from 'path'

const vicunaDir = (...subpaths) => join(homedir(), '.vicuna-ts', ...subpaths)

const main = async () => {
    const vicuna = new LLAMACPP({
        model: vicunaDir('ggml-vicuna-7b-4bit-rev1.bin'),
        executablePath: vicunaDir('main.exe'),
        params:  [
            '-i',
            '--interactive-first',
            '-t',
            '8',
            '--temp',
            '0',
            '-c',
            '2048',
            '-n',
            '-1',
            '--ignore-eos',
            '--repeat_penalty',
            '1.2'
        ]
    })
    await vicuna.init()
    const response = await vicuna.generate(['Hello, I\'m Alen. What\'s your name?']).catch((error) => console.error(error))
    console.log(response.generations)
}

main()