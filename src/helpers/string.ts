// "use strict";

import lodash from "lodash"
import { customAlphabet } from "nanoid"
import { alphanumeric } from "nanoid-dictionary"

export function __setDescription(_description: string): string {
    return lodash
        .chain(_description)
        .split(". ")
        .map(lodash.trim)
        .map(lodash.toLower)
        .map(lodash.capitalize)
        .join(". ")
        .value()
}

export function __setName(_name: string): string {
    return lodash
        .chain(_name)
        .toLower()
        .startCase()
        .value()
}


export function __setMail(_mail: string): string {
    return lodash
        .chain(_mail)
        .toLower()
        .value()
}

export function __setPermission(_permission: string): string {
    return lodash
        .chain(_permission)
        .snakeCase()
        .toUpper()
        .value()
}

export function __setPhone(_phone: String): string {
    return lodash
        .chain(_phone)
        .slice(-9)
        .join("")
        .padStart(12, "233")
        .value()
}

export function __genCode(_length: number = 6): string {
    return lodash
        .chain("9")
        .repeat(_length)
        .parseInt()
        .random()
        .padStart(_length, "0")
        .value()
}

export function __genPassword(_length: number = 8): string {
    return customAlphabet(alphanumeric, _length)()
}