class EntitySchema {
  constructor (name, entityParams = {}, entityConfig = {}) {
    this.name = name
    this.entityParams = entityParams
    this.entityConfig = entityConfig
    // 默认值为字符串'id'
    this.idAttribute = entityConfig.idAttribute || 'id'
    this.init(entityParams)
  }

  getName () {
    return this.name
  }

  getId (input) {
    const { idAttribute } = this
    return input[idAttribute]
  }

  // entityParams中可能存在Schema对象
  init (entityParams) {
    if (!this.schema) this.schema = {}

    for (const key in entityParams) {
      if (Object.prototype.hasOwnProperty.call(entityParams, key)) {
        this.schema[key] = entityParams[key]
      }
    }
  }
}

export const schema = {
  Entity: EntitySchema
}
