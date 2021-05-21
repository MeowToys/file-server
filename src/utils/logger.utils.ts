import { green, red, cyan, hex } from 'chalk'

export const error = (message: string) => {
  console.log(`${cyan(`[Meow File Server] --- ${new Date().toLocaleString()}`)}    ${red(`[ERROR]: ${message}`)}`)
}

export const warning = (message: string) => {
  console.log(`${cyan(`[Meow File Server] --- ${new Date().toLocaleString()}`)}    ${hex('#FF7F00')(`[WARNING]: ${message}`)}`)
}

export const info = (message: string) => {
  console.log(`${cyan(`[Meow File Server] --- ${new Date().toLocaleString()}`)}    ${cyan(`[INFO]: ${message}`)}`)
}

export const log = (message: string) => {
  console.log(`${cyan(`[Meow File Server] --- ${new Date().toLocaleString()}`)}    ${green(`[LOG]: ${message}`)}`)
}