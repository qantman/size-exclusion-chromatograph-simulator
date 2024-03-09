const axios = require('axios')
const _set = require('lodash/set')
const Device = require('./Device')

const IskraDevice = class IskraDevice extends Device {
  static _defaultSettings = {
    title: 'Iskra Device',
    timeout: 1153, // prime
    ip: '127.0.0.1',
    port: 80,
    errors: {}
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
      defaultSettings: IskraDevice._defaultSettings
    }
  }

  constructor (obj, defaultGroups) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'IskraDevice'
    obj.id = obj.id || 'iskraDevice'

    super(obj, IskraDevice._clsConf(defaultGroups))

    this.url = 'http://' + this.ip + ':' + this.port
  }

  _axios (configs) {
    // abort axios request after connection timeout
    var source = axios.CancelToken.source()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        source.cancel()
        return reject(Error(this.title + ': Connection timeout')) 
      }, this.timeout + 100)

      configs = configs || {
        method: 'get',
        url: this.url,
        timeout: this.timeout
      }
      configs.cancelToken = source.token

      return axios(configs)
      .then(r => { return resolve(r) })
      .catch(e => { return reject(e) })
    })
  }

  readAll () {
    return this.addPromise(new Promise((resolve, reject) => {
      return this._axios().then(res => {
        this.values = res.data
        if (this.errors.connection) {
          delete this.errors.connection
        }
        return resolve(this.values)
      }).catch(e => {
        this.errors.connection = e.message
        return reject(e)
      })
    }))
  }

  setGroup (g, group) {
    // Takes an instance of Register class
    return this.addPromise(new Promise((resolve, reject) => {
      return this._axios({
        method: 'post',
        url: this.url,
        timeout: this.timeout,
        data: {
          command: 'writeGroup',
          key: g,
          value: group
        }
      }).then(res => {
        // console.log(this.title + ': writeGroup')
        // let values = {}
        // values[g] = group
        // this.values = values
        if (this.errors.connection) {
          delete this.errors.connection
        }
        return resolve(res)
      }).catch(e => {
        console.log(this.title + ': writeGroup ' + e.message)
        this.errors.connection = e.message
        return reject(e)
      })
    }))
  }

  get values () {
    return super.values
  }

  set values (groups) {
    for (let g in groups) {
      if (g in this.groups) {
        return this.writeGroup(this.groups[g]).
        then(() => {
          for (let r in groups[g].readings) {
            if (r in this.groups[g].readings) {
              _set(this, 'groups[g].readings[r].transformedVal',
                groups[g].readings[r])
            }
          }

          for (let c in groups[g].controls) {
            if (c in this.groups[g].controls) {
              _set(this, 'groups[g].controls[c].transformedVal',
                groups[g].controls[c])
            }
          }
        }).catch(e => { return reject(e) })
      }
    }
  }
}

module.exports = IskraDevice
