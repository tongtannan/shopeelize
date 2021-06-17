const addEntities = (entities) => {
  return (schema, processedEntity) => {
    const schemaKey = schema.getName()
    const id = schema.getId(processedEntity)
    if (!(schemaKey in entities)) {
      entities[schemaKey] = {}
    }
    const existingEntity = entities[schemaKey][id]
    if (existingEntity) {
      entities[schemaKey][id] = Object.assgin(existingEntity, processedEntity)
    } else {
      entities[schemaKey][id] = processedEntity
    }
  }
}

const flatten = (data, schema, addEntity) => {
  // 实体不一定是schema，有可能是数组
  if (typeof schema.getName === 'undefined') {
    return noSchemaNormalize(data, schema, addEntity)
  }
  return schemaNormalize(data, schema, addEntity)
}
// 传入是schema实体
function schemaNormalize (data, schema, addEntity) {
  const processedEntity = { ...data }
  const currentSchema = schema
  Object.keys(currentSchema.schema).forEach((key) => {
    const schema = currentSchema.schema[key]
    const temple = flatten(processedEntity[key], schema, addEntity)
    processedEntity[key] = temple
  })
  addEntity(currentSchema, processedEntity)
  return currentSchema.getId(data)
}
// 非schema实例
function noSchemaNormalize (data, schema, addEntity) {
  // 判断schema是否是数组
  const isArray = schema instanceof Array
  const object = { ...data }
  const arr = []
  Object.keys(schema).forEach((key) => {
    const localSchema = schema[key]
    const value = flatten(data[key], localSchema, addEntity)
    if (isArray) {
      arr.push(value)
    } else {
      object[key] = value
    }
  })
  if (isArray) return arr
  return object
}

export function normalize (data, schema) {
  const entities = {}
  const addEntity = addEntities(entities)
  const result = flatten(data, schema, addEntity)
  return {
    entities,
    result
  }
}
