// const _set = require('lodash/set')
const NamedSet = require('./NamedSet')
const RegistersGroup = require('./RegistersGroup')
const RegistersGroups = require('./RegistersGroups')

const Device = class Device extends NamedSet {
  static _promiseTimeout = 100

  static _classes = {
    RegistersGroup: RegistersGroup,
    ...RegistersGroups
  }

  static _defaultSettings = {
    title: 'Device',
    timeout: 1187, // prime
    errors: {}
  }

  static _clsConf = {
    mapSettings: true,
    classes: Device._classes,
    subsets: {
      groups: {
        mapGetters: true,
        hideAll: false
      }
    },
    defaultSettings: Device._defaultSettings
  }

  constructor (obj, clsConf) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'Device'
    obj.id = obj.id || 'device'
    clsConf = clsConf || Device._clsConf

    super(obj, clsConf)
  }

  addPromise (promise) {
    return new Promise((resolve, reject) => {
      if (!(promise instanceof Promise)) {
        return reject(Error(
          this.title + ': the addToQueue argument is not a promise'))
      }

      // if (this.queue.length > Device.maxQueueLength) {
      //   promise = null
      //   return reject(Error(this.title + ' is busy'))
      // }

      var destroyTimeout = setTimeout(() => {
        promise = null
        return reject(Error(
          this.title + ': the waiting time has expired'))
      }, this.timeout + Device._promiseTimeout)

      return promise.then(r => {
        clearTimeout(destroyTimeout)
        return resolve(r)
      }).catch(e => {
        clearTimeout(destroyTimeout)
        return reject(e)
      })
    })
  }

  // Rewrite this in a child class
  readAll () {
    return this.addPromise(new Promise((resolve, reject) => {
      try {
        return resolve(this.values)
      } catch (e) {
        return reject(e)
      }
    }))
  }

  // Rewrite this in a child class
  setGroup (g, group) {
    if (!g || !group || !this.groups[g]) {
      return false
    }
    var change = false
    var changesStr = '' + g + '('

    for (let c in group.controls) {
      if (c in this.groups[g].controls) {
        this.groups[g].controls[c].transformedVal =
          group.controls[c]
        changesStr = changesStr + c + '=' +
          this.groups[g].controls[c].transformedVal + '; '
        change = true
      }
    }
    if (change) {
      return (changesStr.slice(0, -2) + ')')
    } else {
      return false
    }
  }

  get values () {
    let res = {}
    for (let g in this.groups) {
      res[g] = { readings: {}, controls: {} }
      for (let r in this.groups[g].readings) {
        res[g].readings[r] = this.groups[g].readings[r].transformedVal
      }
      for (let c in this.groups[g].controls) {
        res[g].controls[c] = this.groups[g].controls[c].transformedVal
      }
    }
    // console.log(this.title, 'values', res)
    return res
  }

  set values (groups) {
    for (let g in groups) {
      if (g in this.groups) {
        for (let r in groups[g].readings) {
          if (r in this.groups[g].readings) {
            this.groups[g].readings[r].transformedVal =
              groups[g].readings[r]
          }
        }
        for (let c in groups[g].controls) {
          if (c in this.groups[g].controls) {
            this.groups[g].controls[c].transformedVal =
              groups[g].controls[c]
          }
        }
      }
    }
  }
}

module.exports = Device
