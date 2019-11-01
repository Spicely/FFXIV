export const prefix: string = 'mk_'

/**
 * @param {string} name 类名会和prefix结合
 * @param {string} extendClass  扩展类名-字符串拼接
 */
export function getClassName(name: string = '', extendClass?: string) {
    return `${prefix + name}${extendClass ? ' ' + extendClass : ''}`
}

export interface IValue {
    [name: string]: any
}
