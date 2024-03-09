const _set = require('lodash/set')
const ModbusRTU = require('modbus-serial')
const Device = require('./Device')

const ModbusDevice = class ModbusDevice extends Device {
  static _defaultSettings = {
    title: 'Modbus Device',
    timeout: 1249, // prime
    ip: '127.0.0.1',
    port: 502,
    client: null,
    unit: 1,
    regs: [],
    coils: [],
    errors: {},
    active: false,

    // Read 'coilsReadSamples' samples 'coilsReadTimes' times
    coilsReadSamples: 40,
    coilsReadTimes: 1,
    // Read 'holdRegReadSamples' samples 'holdRegReadTimes' times
    holdRegReadSamples: 125,
    holdRegReadTimes: 3
  }

  static _clsConf (defaultGroups) {
    return {
      mapSettings: true,
      classes: super._classes,
      subsets: {
        groups: {
          mapGetters: true,
          hideAll: false,
          default: defaultGroups
        }
      },
      defaultSettings: ModbusDevice._defaultSettings
    }
  }

  connect () {
    if (this.client.isOpen) {
      return Promise.resolve(this.client)
    }

    return this.client.connectTCP(
      this.ip,
      { port: this.port,
        unitID: this.unit,
        timeout: this.timeout })
    .then((unitID) => {
      this.active = true
      this.unit = unitID
      if (this.errors.connection) {
        delete this.errors.connection
      }
    })
    .catch((e) => {
      this.active = false
      this.errors.connection = e.message
    }).finally(() => {
      return Promise.resolve(this.client)
    })
  }

  constructor (obj, defaultGroups) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'ModbusDevice'
    obj.id = obj.id || 'modbusDevice'

    super(obj, ModbusDevice._clsConf(defaultGroups))

    this.client = new ModbusRTU()
    this.connect()
  }

  readAll () {
    return this.addPromise(new Promise((resolve, reject) => {
      return this.connect().then(async () => {
        this.regs.length = 0

        // Read 'coilsReadSamples' samples 'coilsReadTimes' times
        for (let i = 0; i < this.coilsReadTimes; i++) {
          await this.client.readCoils(
            i*this.coilsReadSamples, this.coilsReadSamples)
          .then(c => {
            if (this.errors.coils) {
              delete this.errors.coils
            }
            this.coils = c.data
          }).catch(e => {
            this.errors.coils = e.message
          })
        }

        // Read 'holdRegReadSamples' samples 'holdRegReadTimes' times
        for (let i = 0; i < this.holdRegReadTimes; i++) {
          await this.client.readHoldingRegisters(
            i*this.holdRegReadSamples, this.holdRegReadSamples)
          .then(r => {
            if (this.errors.holdingRegisters) {
              delete this.errors.holdingRegisters
            }
            this.regs = this.regs.concat(r.data)
          }).catch(e => {
            this.errors.holdingRegisters = e.message
          })
        }

        for (let g in this.groups) {
          for (let r in this.groups[g].readings) {
            // setter 'regs' from Register class:
            this.groups[g].readings[r].coils = this.coils
            this.groups[g].readings[r].regs = this.regs
          }
          for (let c in this.groups[g].controls) {
            // setter 'regs' from Register class:
            this.groups[g].controls[c].coils = this.coils
            this.groups[g].controls[c].regs = this.regs
          }
        }
        return resolve(this.values)
      }).catch(e => { return reject(e) })
    }))
  }

  writeReg (reg) {
    // Takes an instance of Register class
    return this.addPromise(new Promise((resolve, reject) => {
      return this.connect().then(() => {
        switch (reg.type) {
          case 0:
          case 'bit':
          case 'bool':
          case 'coil':
            return this.client.writeCoil(reg.addr, reg.bytes)
              .then(e => { return resolve(true) })
              .catch(e => { return reject(e) })
          case 1:
          case 'byte':
          case 'single':
            return this.client.writeRegisters(reg.addr, reg.bytes)
              .then(e => { return resolve(true) })
              .catch(e => { return reject(e) })
          case 2:
          case 'float':
          case 'float32':
          case 'word':
          case 'double':
            // console.log('writeReg: reg.bytes', reg.bytes)
            return this.client.writeRegisters(reg.addr, reg.bytes)
              .then(e => { return resolve(true) })
              .catch(e => { return reject(e) })
          default:
            return reject(Error('Unknown register type ' + reg.type))
        }
      }).catch(e => {
        console.log('ModbusDevice writeReg error:', e.message)
        return reject(e)
      })
    }))
  }

  setGroup (g, group) {
    // Takes an instance of Register class
    return this.addPromise(new Promise(async (resolve, reject) => {
      try {
        if (!g || !group || !this.groups[g]) {
          return resolve(false)
        }
        var change = false
        var changesStr = '' + g + '('

        for (let c in group.controls) {
          if (c in this.groups[g].controls) {
            this.groups[g].controls[c].transformedVal =
              group.controls[c]
            await this.writeReg(this.groups[g].controls[c])
            changesStr = changesStr + c + '=' +
              this.groups[g].controls[c].transformedVal + '; '
            change = true
          }
        }
        if (change) {
          return resolve(changesStr.slice(0, -2) + ')')
        } else {
          return resolve(false)
        }
      } catch (e) { return reject(e) }
    }))
  }

  get values () {
    return super.values
  }

  set values (groups) {
    const run = async () => {
      for (let g in groups) {
        if (g in this.groups) {
          for (let r in groups[g].readings) {
            if (r in this.groups[g].readings) {
              _set(this, 'groups[g].readings[r].transformedVal',
                groups[g].readings[r])
              await this.writeReg(this.groups[g].readings[r])
            }
          }

          for (let c in groups[g].controls) {
            if (c in this.groups[g].controls) {
              _set(this, 'groups[g].controls[c].transformedVal',
                groups[g].controls[c])
              await this.writeReg(this.groups[g].controls[c])
            }
          }
        }
      }
    }
    run()
  }
}

module.exports = ModbusDevice
