const _merge = require('lodash/merge')

const Package = class Package {
  constructor (obj, id, toSend) {
    obj = obj || {}
    this.clsName = obj.clsName || 'Package'
    this.id = id || obj.id || 'package'

    this.result = obj.result || {}
    this.errors = obj.errors || {}

    this.toSend = toSend || {}
  }

  setError (e, ref) {
    ref = ref || e.name || 'other'
    let mes = e.message || String(e)
    this.errors[ref] = mes
    e = { name: ref, message: mes }
    return e
  }

  deleteError (ref) {
    if (this.errors && this.errors[ref]) {
      delete this.errors[ref]
    }
  }

  get send () {
    var r = this.toSend || {}
    if (this.result) { r.result = this.result }
    if (this.errors) { r.errors = this.errors }
    return r
  }

  set send (v) {
    if (typeof v === 'string' || v instanceof String) {
      this.result = v
    } else {
      _merge(this.toSend, v)
    }
  }
}

module.exports = Package
