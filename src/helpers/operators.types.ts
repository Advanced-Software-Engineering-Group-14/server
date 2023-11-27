import { ObjectId } from "mongoose";

export interface BooleanOperationInputProp {
  eq?: boolean
  ne?: boolean
}

export interface BooleanOperationOutputProp {
  $or: any
}

export interface DateOperationInputProp {
  eq?: Date
  between?: {
    start: Date
    end: Date
  }
  before?: Date
  after?: Date
}

export interface DateOperationOutputProp {
  $or: any
}

export interface IdOperationInputProp {
  eq?: ObjectId
  notIn?: ObjectId[]
}

export interface IdOperationOutputProp {
  $or: any
}

export interface NumberOperationInputProp {
  eq?: number
  between?: {
    start: number
    end: number
  }
}

export interface NumberOperationOutputProp {
  $or: any
}

export interface StringOperationInputProp {
  eq?: string
  notIn?: string[]
  notEq?: string
  notContains?: string
  contains?: string
  regex?: string
}

export interface StringOperationOutputProp {
  $or: any
}