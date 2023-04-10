export const readControlChar = (data: string) => ['\u001b', '\n', '>'].every((char) => data.includes(char))
