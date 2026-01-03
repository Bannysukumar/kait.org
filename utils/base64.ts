// Encode and Decode Base64

const encode = (input: string) =>
  typeof btoa !== 'undefined'
    ? btoa(input)
    : Buffer.from(input).toString('base64')
const decode = (input: string) =>
  typeof atob !== 'undefined'
    ? atob(input)
    : Buffer.from(input, 'base64').toString()

const encodeObj = (input: object | string) =>
  encode(JSON.stringify(input, null, 2))
const decodeObj = (input: string) => JSON.parse(decode(input))

export { encode, decode, encodeObj, decodeObj }
