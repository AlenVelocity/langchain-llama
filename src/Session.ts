import { ChildProcess, spawn } from 'child_process'

export type SessionOptions = {
    bin: string
    params: string[]
    model: string
}

export class LLAMACPPSession {
    private process?: ChildProcess
    public initialized = false

    constructor(private options: SessionOptions) {}

    public initialize = () => {
        const { bin, params, model } = this.options
        params.push('--model', model)
        return new Promise<void>((resolve, reject) => {
            this.process = spawn(bin, params, { stdio: ['pipe', 'pipe', 'ignore'] })

            this.process.on('error', (err) => {
                this.process = undefined
                reject(new Error(`Failed to start ${bin}: ${err}`))
            })
            this.process.on('exit', (code) => {
                reject(new Error(`${bin} exited with code ${code}`))
            })
            this.process.on('close', (code) => {
                reject(new Error(`${bin} closed with code ${code}`))
            })
            this.process.stdout?.on('data', (data) => {
                if (data.toString().includes('>')) {
                    this.initialized = true
                    resolve()
                }
            })
        })
    }

    public prompt = (prompt: string, cb?: (s: string) => void): Promise<string> => {
        if (!this.process) {
            throw new Error('Session is not initialized.')
        }

        if (this.process?.stdin) this.process.stdin.write(prompt + '\n')
        return new Promise((resolve, reject) => {
            let response = ''
            let timeoutId: NodeJS.Timeout

            const onStdoutData = (data: Buffer) => {
                const text = data.toString()
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }

                if (text.includes('>')) {
                    if (cb) cb('<end>')
                    terminateAndResolve(response)
                } else {
                    timeoutId = setTimeout(() => {
                        terminateAndResolve(response)
                    }, 10000)
                }
                cb?.(text)
                response += text
            }

            const onStdoutError = (err: Error) => {
                if (!this.process?.stdout) return reject(err)
                this.process.stdout.removeListener('data', onStdoutData)
                this.process.stdout.removeListener('error', onStdoutError)
                reject(err)
            }

            const terminateAndResolve = (finalResponse: string) => {
                if (!this.process?.stdout) return resolve(finalResponse)
                this.process.stdout.removeListener('data', onStdoutData)
                this.process.stdout.removeListener('error', onStdoutError)
                // check for > at the end and remove it
                if (finalResponse.endsWith('>')) {
                    finalResponse = finalResponse.slice(0, -1)
                }
                resolve(finalResponse)
            }
            if (!this.process?.stdout) return
            this.process.stdout.on('data', onStdoutData)
            this.process.stdout.on('error', onStdoutError)
        })
    }

    public kill = () => this?.process?.kill()
}
