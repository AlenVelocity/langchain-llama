<div align=center>

# GPTFunctions

### **Convert raw text into actual Javascript Functions**


[![NPM](https://img.shields.io/npm/l/gpt-functions?style=flat-square&label=License)](https://github.com/AlenVelocity/gpt-functions/blob/master/LICENSE) [![CodeFactor](https://img.shields.io/codefactor/grade/github/AlenVelocity/gpt-functions?style=flat-square&label=Code%20Quality)](https://www.codefactor.io/repository/github/AlenVelocity/gpt-functions) [![NPM](https://img.shields.io/npm/dw/gpt-functions?style=flat-square&label=Downloads)](https://npmjs.com/package/gpt-functions)

</div>

## Installation

```shell
npm install gpt-functions
```

## Usage

### Initialiaze the GPT Functions class

```js
import { GPTFunctions } from 'gpt-functions'

const API_KEY = 'your-openai-api-key-here'
const gpt = new GPTFunctions(API_KEY)
```

### **.createFunction()**

#### Example Usage

```js
const celsiusToFahrenheit = await gpt.createFunction('convert the given temperature from Celsius to Fahrenheit')

console.log(celsiusToFahrenheit(25))
console.log(celsiusToFahrenheit(10))
```
**Output**
```js
77
50
```

#### Using the Options Object (Recommended way)
```js
const permutations = await gpt.createFunction({
    func: '(array) => array',
    desc: 'Return all permutations of the passed array'
})

console.log(permutations([1,2,3]))
```

**Output**
```js
[
  [ 1, 2, 3 ],
  [ 1, 3, 2 ],
  [ 2, 1, 3 ],
  [ 2, 3, 1 ],
  [ 3, 1, 2 ],
  [ 3, 2, 1 ]
]
```

**⚠️ WARNING ⚠️**
> NEVER PASS RAW USER INPUT WITHOUT VALIDATING IT FIRST. GPTFUNCTIONS USES THE JS FUNCTION CONSTRUCTOR, WHICH CAN EXECUTE ARBITRARY CODE. AN ATTACKER COULD EXPLOIT THIS TO RUN MALICIOUS CODE ON YOUR SYSTEM. ALWAYS VALIDATE USER INPUT AND SANITIZE IT BEFORE PASSING IT

.createFunction() is a method that takes a string as the functio description or an object with the following properties as its parameter:

    func: a string that represents the type of the fucntion
    desc: a string that describes what the code does
    model: the name of the OpenAI model you want to use to execute the code
    evaulate: a function evaluates the string to a an actual function `Default: Function Constructor`

The createFunction() method returns a function that can be called with arguments to execute the code provided in the `func` property.

Note that the createFunction() function does not execute the code immediately, but instead returns a function that can be used to execute the code later

### **GPTFunctions.prototype.getResult()**

```js
const result = await gpt.getResult({
    func: '(array, array) => array',
    args: [['a', 'b', 'c'], ['x', 'y', 'z']],
    desc: 'Creates an array of arrays, grouping the elements of each input array based on their index.'
})

console.log(result)
```

**Output**
```js
[ [ 'a', 'x' ], [ 'b', 'y' ], [ 'c', 'z' ] ]
```

GPTFunctions.prototype.getResult() is a function that takes an object with the following properties as its parameter:

- `func`: a string that represents the code you want to execute
- `args`: an array of arrays containing the arguments to pass to the func.
- `desc`: a string that describes what the code does.
- `model`: the name of the OpenAI model you want to use to execute the code.
- `postProcess`: a function to parse the API response

The `getResult()` method returns a Promise that resolves to the result of executing the code.

## Contribution and Acknowledgments

If you find any issues or have any suggestions for improvement, please feel free to open an issue or a pull request.

- [OpenAI API](openai.com)
- [Torantulino/AI_Functions](https://github.com/Torantulino/AI-Functions)
