const IskraRegister = require('./IskraRegister')

const Registers = {}

Registers.IskraCond = class IskraCond extends IskraRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'IskraCond'
    id = id || obj.id || 'cond'
    obj.units = obj.units || 'mS/cm'
    obj.digits = obj.digits || 4

    super(obj, id)
  }
}

Registers.IskraPh = class IskraPh extends IskraRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'IskraPh'
    id = id || obj.id || 'pH'
    obj.units = obj.units || 'pH units'
    obj.digits = obj.digits || 2

    super(obj, id)
  }
}

Registers.IskraPress = class IskraPress extends IskraRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'IskraPress'
    id = id || obj.id || 'press'
    obj.units = obj.units || 'bar'
    obj.digits = obj.digits || 0

    super(obj, id)
  }
}

Registers.IskraBool = class IskraBool extends IskraRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'IskraBool'
    id = id || obj.id || 'bool'
    obj.type = obj.type || 0

    super(obj, id)
  }
}

module.exports = Registers
