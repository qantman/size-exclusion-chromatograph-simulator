const ModbusDevice = require('./ModbusDevice')
const IskraDevice = require('./IskraDevice')

const Devices = {}

Devices.ModbusPLC = class ModbusPLC extends ModbusDevice {
  constructor (obj, defaultGroups) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusPLC'
    obj.id = obj.id || 'modbusPLC'

    obj.settings = obj.settings || {}
    obj.settings.title = obj.settings.title || 'ModbusPLC'
    obj.settings.timeout = obj.settings.timeout || 1249 // prime
    obj.settings.ip = obj.settings.ip || '25.25.5.2'
    obj.settings.port = obj.settings.port || 502

    super(obj, defaultGroups)
  }
}

Devices.IskraMain = class IskraMain extends IskraDevice {
  constructor (obj, defaultGroups) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'IskraMain'
    obj.id = obj.id || 'iskraMain'

    obj.settings = obj.settings || {}
    obj.settings.title = obj.settings.title || 'IskraMain'
    obj.settings.timeout = obj.settings.timeout || 1153 // prime
    obj.settings.ip = obj.settings.ip || '25.25.5.204'
    obj.settings.port = obj.settings.port || 80

    super(obj, defaultGroups)
  }
}

Devices.IskraPh = class IskraPh extends IskraDevice {
  constructor (obj, defaultGroups) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'IskraPh'
    obj.id = obj.id || 'iskraPh'

    obj.settings = obj.settings || {}
    obj.settings.title = obj.settings.title || 'IskraPh'
    obj.settings.timeout = obj.settings.timeout || 1129 // prime
    obj.settings.ip = obj.settings.ip || '25.25.5.205'
    obj.settings.port = obj.settings.port || 80

    super(obj, defaultGroups)
  }
}

module.exports = Devices
