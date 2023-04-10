/* eslint-disable @typescript-eslint/no-unused-vars */
import { LLM } from 'langchain/llms'
import { LLAMACPPSession } from './Session'
import { BaseCache } from 'langchain/dist/cache'
import { BaseLanguageModelParams } from 'langchain/dist/base_language'

interface BaseLLMParams extends BaseLanguageModelParams {
    concurrency?: number
    cache?: BaseCache | boolean
}

export interface LLAMACPPLLMParameters {
    model: string
    stream?: boolean
    executablePath: string
    params?: string[]
}

export class LLAMACPP extends LLM {
    private session?: LLAMACPPSession

    constructor(private options: BaseLLMParams & LLAMACPPLLMParameters) {
        super(options)
        this.newSession()
    }

    public init = this.session?.initialize

    private newSession = () => {
        this.closeSession()
        this.session = new LLAMACPPSession({
            bin: this.options.executablePath,
            params: this.options.params ?? [],
            model: this.options.model
        })
        this.init = this.session?.initialize
        return true
    }

    private closeSession = () => {
        this.session?.kill()
    }

    public _call = async (prompt: string, _stop: string[]): Promise<string> => {
        if (!this.session) this.newSession()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.session!.prompt(prompt, this.options.stream ? process.stdout.write : undefined)
    }

    public _llmType() {
        return 'llama.cpp'
    }
}
