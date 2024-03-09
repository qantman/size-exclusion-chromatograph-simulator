const Register = require('./Register')

const ModbusRegister = class ModbusRegister extends Register {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusRegister'
    super(obj, id)
  }

  get bytes () {
    switch (this.type) {
      case 0:
      case 'bit':
      case 'bool':
      case 'coil':
        return this.transformedVal
      case 1:
      case 'byte':
      case 'single':
        return [this.transformedVal]
      case 2:
      case 'float':
      case 'float32':
      case 'word':
      case 'double':
        let buf = new ArrayBuffer(32)
        let dv = new DataView(buf, 0)
        let res = []

        dv.setFloat32(0, this.transformedVal)

        res.push(dv.getInt16(16))
        res.push(dv.getInt16(0))
        return res
      default:
        return this.transformedVal
    }
  }

  set coils (coils) {
    var addr = (coils.length > 2) ? this.addr : 0
    switch (this.type) {
      case 0:
      case 'bit':
      case 'bool':
      case 'coil':
        this.transformedVal = coils[addr]
        break
    }
  }

  set regs (regs) {
    var addr = (regs.length > 2) ? this.addr : 0
    switch (this.type) {
      case 0:
      case 'bit':
      case 'bool':
      case 'coil':
        break
      case 2:
      case 'float':
      case 'float32':
      case 'word':
      case 'double':
        let buf = new ArrayBuffer(32)
        let dv = new DataView(buf, 0)
        dv.setInt16(0, regs[addr + 1])
        dv.setInt16(16, regs[addr])
        this.transformedVal = dv.getFloat32(0)
        break
      default:
        this.transformedVal = regs[addr]
    }
  }
}

module.exports = ModbusRegister
