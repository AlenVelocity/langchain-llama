# Langchain-LLAMA

Run LLAMA LLMs locally in langchain. Ported from [linonetwo/langchain-alpaca](https://github.com/linonetwo/langchain-alpaca)

```shell
npm i langchain-llama
```

# Usage 
This example uses the `ggml-vicuna-7b-4bit-rev1` model

```ts
import { LLAMACPP } from 'langchain-llama'

const main = async () => {
    const vicuna = new LLAMACPP({ 
        model: './vicuna/ggml-vicuna-7b-4bit-rev1.bin', // Path to model
        executablePath: './vicuna/main.exe', // Path to binary
        params:  [ // Parameters to pass to the binary
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
    const response = await vicuna.generate(['Say "Hello World"'])
    console.log(response.generations)

}

main()
```

This project is still a work in progress. Better docs will be added soon
