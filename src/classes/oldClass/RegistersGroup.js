const NamedSet = require('./NamedSet')
const Register = require('./Register')
const ModbusRegister = require('./ModbusRegister')
const ModbusRegisters = require('./ModbusRegisters')
const IskraRegister = require('./IskraRegister')
const IskraRegisters = require('./IskraRegisters')

const RegistersGroup = class RegistersGroup extends NamedSet {
  static _classes = {
    Register: Register,
    ModbusRegister: ModbusRegister,
    IskraRegister: IskraRegister,
    ...IskraRegisters,
    ...ModbusRegisters,
  }

  static _clsConf (defaultReadings, defaultControls) {
    return {
      classes: RegistersGroup._classes,
      subsets: {
        readings: {
          mapGetters: true,
          hideAll: false,
          default: defaultReadings
        },
        controls: {
          mapGetters: true,
          hideAll: false,
          default: defaultControls
        }
      }
    }
  }

  checkIdInReadings (id) {
    return NamedSet.checkIdInObj(id, this.readings)
  }

  checkIdInControls (id) {
    return NamedSet.checkIdInObj(id, this.controls)
  }

  addReading (reading, id, clsName, unique = false) {
    reading = reading || {}
    reading.clsName = clsName || reading.clsName
    return NamedSet.prototype.addUniqueObjToSubset.call(this, {
      obj: reading,
      id: id,
      subset: 'readings',
      unique: unique,
      classes: RegistersGroup._classes
    })
  }

  addControl (control, id, clsName, unique = false) {
    control = control || {}
    control.clsName = clsName || control.clsName
    return NamedSet.prototype.addUniqueObjToSubset.call(this, {
      obj: control,
      id: id,
      subset: 'controls',
      unique: unique,
      classes: RegistersGroup._classes
    })
  }

  constructor (obj, defaultSubsets) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'RegistersGroup'
    obj.id = obj.id || 'registersGroup'
    obj.settings = obj.settings || {}
    defaultSubsets = defaultSubsets || {}

    super(obj, RegistersGroup._clsConf(
      defaultSubsets.readings, defaultSubsets.controls))
  }
}

module.exports = RegistersGroup