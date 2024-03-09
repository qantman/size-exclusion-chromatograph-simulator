const RegistersGroup = require('./RegistersGroup')
const groups = require('./groups')

const rgMixin = (clsName, defaultId, defaultSubsets) => class extends RegistersGroup {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || clsName
    obj.id = id || obj.id || defaultId

    super(obj, defaultSubsets)
  }
}

var Groups = {}

for (let g in groups) {
  Groups[g] = rgMixin(g, groups[g].defaultId, groups[g].defaultSubsets)
}

module.exports = Groups
