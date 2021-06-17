const unflattenEntity = (id, schema, unflatten, getEntity, cache) => {
  const entity = getEntity(id, schema)
  if (!cache[schema.getName()]) {
    cache[schema.getName()] = {}
  }
  if (!cache[schema.getName()][id]) {
    const entityCopy = { ...entity }
    // 递归的方法，存在schema嵌套的情况下要一级接着一级的往下递归到根部
    Object.keys(schema.schema).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(entityCopy, key)) {
        const uschema = schema.schema[key]
        entityCopy[key] = unflatten(entityCopy[key], uschema)
      }
    })
    cache[schema.getName()][id] = entityCopy
  }
  return cache[schema.getName()][id]
}
// 不是schema实例
const unflattenNoEntity = (schema, input, unflatten) => {
  const object = { ...input }
  const arr = []
  const isArray = schema instanceof Array
  // 同样的要针对数组和非数组的情况进行判别
  Object.keys(schema).forEach((key) => {
    if (isArray) {
      if (object[key]) {
        object[key] = unflatten(object[key], schema[key])
      }
      arr.push(unflatten(object[key], schema[key]))
    } else {
      if (object[key]) {
        object[key] = unflatten(object[key], schema[key])
      }
    }
  })
  if (isArray) {
    return arr
  }
  return object
}

const getUnflatten = (entities) => {
  const cache = {}
  const getEntity = getEntities(entities)
  return function unflatten (data, schema) {
    if (typeof schema.getName === 'undefined') {
      return unflattenNoEntity(schema, data, unflatten)
    }
    return unflattenEntity(data, schema, unflatten, getEntity, cache)
  }
}
/**
 * [传入的是entities,这样可以获取对应schema的某个id所对应的对象]
 * @param  {[type]} entities [description]
 * @return {[type]}          [description]
 */
const getEntities = (entities) => {
  return (entityOrId, schema) => {
    const schemaKey = schema.getName()
    if (typeof entityOrId === 'object') {
      return entityOrId
    }
    return entities[schemaKey][entityOrId]
  }
}

export const denormalize = (result, schema, entities) =>
  getUnflatten(entities)(result, schema)
