import lodash from "lodash"
import { __getDateEnd, __getDateStart } from "./date"
import { BooleanOperationInputProp, BooleanOperationOutputProp, DateOperationInputProp, DateOperationOutputProp, IdOperationInputProp, IdOperationOutputProp, NumberOperationInputProp, NumberOperationOutputProp, StringOperationInputProp, StringOperationOutputProp } from "./operators.types";

export function __getBooleanOperation(field: string, operation: BooleanOperationInputProp): BooleanOperationOutputProp {
  return ({
    $or: [
      ...(lodash.chain(operation)
        .mapKeys(function(value, key) {
          return "$" + key
        })
        .toPairs()
        .map(function([name, value]) {
          return ({[field]: {[name]: value}})
        })
        .value()
      )
    ]
  })
}

export function __getDateOperation(field: string, {between, before, after, eq, ...operation}: DateOperationInputProp): DateOperationOutputProp {
  return ({
    $or: [
      ...(lodash.chain(operation)
        .mapKeys(function(value, key) {
          return "$" + key
        })
        .toPairs()
        .map(function([name, value]) {
          return ({[field]: {[name]: value}})
        })
        .value()
      ),
      ...(
        eq
        ? [{[field]: {
          $lte: __getDateEnd(eq).toISOString(),
          $gte: __getDateStart(eq).toISOString(),
        }}]
        : []
      ),
      ...(
        before
        ? [{[field]: {$lte: before}}]
        : []
      ),
      ...(
        after
        ? [{[field]: {$gte: after}}]
        : []
      ),
      ...(
        between
        ? [{[field]: {
          $lte: between.end,
          $gte: between.start,
        }}]
        : []
      )
    ]
  })
}

export function __getIdOperation(field: string, {notIn, ...operation}: IdOperationInputProp): IdOperationOutputProp {
  return ({
    $or: [
      ...(lodash.chain(operation)
        .mapKeys(function(value, key) {
          return "$" + key
        })
        .toPairs()
        .map(function([name, value]) {
          return ({[field]: {[name]: value}})
        })
        .value()
      ),
      ...(
        notIn
        ? [{[field]: {$nin: notIn}}]
        : []
      ),
    ]
  })
}

export function __getNumberOperation(field: string, {between, ...operation}: NumberOperationInputProp): NumberOperationOutputProp {
  return ({
    $or: [
      ...(lodash.chain(operation)
        .mapKeys(function(value, key) {
          return "$" + key
        })
        .toPairs()
        .map(function([name, value]) {
          return ({[field]: {[name]: value}})
        })
        .value()
      ),
      ...(
        between
        ? [{[field]: {
          $lte: between.end,
          $gte: between.start,
        }}]
        : []
      )
    ]
  })
}

export function __getStringOperation(field: string, {notIn, notEq, notContains, contains, regex, ...operation}: StringOperationInputProp): StringOperationOutputProp {
  return ({
    $or: [
      ...(lodash.chain(operation)
        .mapKeys(function(value, key) {
          return "$" + key
        })
        .toPairs()
        .map(function([name, value]) {
          return ({[field]: {[name]: value}})
        })
        .value()
      ),
      ...(
        notIn
        ? [{[field]: {$nin: notIn}}]
        : []
      ),
      ...(
        notEq
        ? [{[field]: {$ne: notEq}}]
        : []
      ),
      ...(
        regex
        ? [{[field]: {$regex: regex, $options: "im"}}]
        : []
      ),
      ...(
        contains
        ? [{[field]: {$regex: `.*${contains}.*`, $options: "im"}}]
        : []
      ),
      ...(
        notContains
        ? [{[field]: {$not: {$regex: `.*${notContains}.*`, $options: "im"}}}]
        : []
      )
    ]
  })
}


export default {
  __getBooleanOperation,
  __getDateOperation,
  __getIdOperation,
  __getNumberOperation,
  __getStringOperation,  
}