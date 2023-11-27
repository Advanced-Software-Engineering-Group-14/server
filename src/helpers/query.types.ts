import { PopulateOptions, SortOrder } from "mongoose";

export interface GenerateQueryInputProps {
  sort?: object
  pagination?: {
    skip: number
    limit: number
  }
  populate?: string[]
  filter?: object
  search?: {
    query: string
    fields: string[]
    options: string[]
  }
  extraFilter?: object
}

export interface GenerateQueryOutputProps {
  filter: object
  sort: {[key: string]: SortOrder}
  populate: PopulateOptions[] | PopulateOptions
  skip: number
  limit: number
}