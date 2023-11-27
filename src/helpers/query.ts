"use strict";

import lodash from "lodash"
import { model } from "mongoose"
import { __getBooleanOperation, __getDateOperation, __getIdOperation, __getNumberOperation, __getStringOperation } from "./operators"
import { __flattenObj, __mergeObj } from "./object"
import { GenerateQueryInputProps, GenerateQueryOutputProps } from "./query.types";

const __operator: object | any = {
  Boolean: __getBooleanOperation,
  Date: __getDateOperation,
  ObjectId: __getIdOperation,
  Number: __getNumberOperation,
  String: __getStringOperation
}

export function traverse(path: any, schemaType: any, res: any = {} , parent = "") {
  let __path = parent ? [parent, path].join(".") : path
  if(schemaType.instance === "Embedded") {
    schemaType.schema.eachPath(function(_path: any, _schemaType: any) {
      traverse(_path, _schemaType, res, __path)
    })
  }
  else{
    res[__path] = schemaType.instance
  }
}

export function getPopulate(data = "") {
  let obj: any = {
    path: "",
  };

    let _split = data.split(".");
    if(!obj["path"].includes(_split[0])) {
      obj["path"] = [obj["path"], _split[0]].join(" ").trim();
    }
    if(_split.length > 1) {
      _split.shift()
      obj["populate"] = __mergeObj(obj["populate"], getPopulate(_split.join(".")))
    }

  return obj;
}

export function __generateQuery(modelName: string, {
  sort = {},
  pagination = {skip: 0, limit: 0},
  populate = [],
  filter = {},
  search = {query: "", fields: ["code"], options: [""]},
  extraFilter = {}
}: GenerateQueryInputProps): GenerateQueryOutputProps {
  let fieldTypes: object[] = [];
  model(modelName)
    .schema
    .eachPath(function(path, schemaType) {
      let obj = {};
      traverse(path, schemaType, obj)
      fieldTypes.push(obj)
    });
  let _fieldTypes = lodash.merge({}, ...fieldTypes);
  const __filter = [
    ...(lodash.chain(filter)
      .mapValues(function(value, key) {
        return __operator[_fieldTypes[key]](key, value)
      })
      .toPairs()
      .map(function([field, value]) {
        return value
      })
      .value()
    )
  ]

  const __search = [
    ...(search ? lodash.chain(search.fields)
      .map((_field) => ({
        [_field]: {
          $regex: search.query,
          $options: (search.options ? search.options.join("") : "")
        }
      }))
      .value() : []
    )
  ]

  return ({
    filter: {
      ...(__filter.length > 0 ? {$and: __filter} : {}),
      ...(search && search.query.length > 0 ? {$or: __search} : {}),
      ...extraFilter
    },
		sort: {
      createdAt: "descending",
      ...(__flattenObj(sort)),
    },
		//select: __select,
    populate: !!populate?.length ? populate.map((pop) => getPopulate(pop)) : [],
		skip: pagination?.skip || 0,
		limit: pagination?.limit || 0
  })
}

export default {
  __generateQuery,
}