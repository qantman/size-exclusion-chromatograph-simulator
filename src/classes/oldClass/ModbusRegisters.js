const ModbusRegister = require('./ModbusRegister')

const Registers = {}

Registers.ModbusCond = class ModbusCond extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusCond'
    id = id || obj.id || 'cond'
    obj.units = obj.units || 'mS/cm'
    obj.digits = obj.digits || 4

    super(obj, id)
  }
}

Registers.ModbusPh = class ModbusPh extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusPh'
    id = id || obj.id || 'pH'
    obj.units = obj.units || 'pH units'
    obj.digits = obj.digits || 2

    super(obj, id)
  }
}

Registers.ModbusTemp = class ModbusTemp extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusTemp'
    id = id || obj.id || 'temp'
    obj.units = obj.units || '°C'
    obj.digits = obj.digits || 1

    super(obj, id)
  }
}

Registers.ModbusFlow = class ModbusFlow extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusFlow'
    id = id || obj.id || 'flow'
    obj.units = obj.units || 'l/h'
    obj.digits = obj.digits || 1

    super(obj, id)
  }
}

Registers.ModbusPump = class ModbusPump extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusPump'
    id = id || obj.id || 'pump'
    obj.units = obj.units || '%'
    obj.digits = obj.digits || 0

    super(obj, id)
  }
}

Registers.ModbusVolt = class ModbusVolt extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusVolt'
    id = id || obj.id || 'voltage'
    obj.units = obj.units || 'V'
    obj.digits = obj.digits || 1

    super(obj, id)
  }
}

Registers.ModbusCurrent = class ModbusCurrent extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusCurrent'
    id = id || obj.id || 'current'
    obj.units = obj.units || 'A'
    obj.digits = obj.digits || 3

    super(obj, id)
  }
}

Registers.ModbusTimer = class ModbusTimer extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusTimer'
    id = id || obj.id || 'timer'
    obj.units = obj.units || 'sec'
    obj.digits = obj.digits || 0
    obj.type = obj.type || 1

    super(obj, id)
  }
}

Registers.ModbusPerc = class ModbusPerc extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusPerc'
    id = id || obj.id || 'perc'
    obj.units = obj.units || '%'
    obj.digits = obj.digits || 0
    obj.type = obj.type || 1

    super(obj, id)
  }
}

Registers.ModbusBool = class ModbusBool extends ModbusRegister {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusBool'
    id = id || obj.id || 'bool'
    obj.type = obj.type || 0

    super(obj, id)
  }
}

module.exports = Registers
