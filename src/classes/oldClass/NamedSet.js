const _get = require('lodash/get')

function * idMaker () {
  var i = new Date().getTime()
  while (true) {
    yield 'id' + i++
  }
}
var gen = idMaker()

class NamedSet {
  static _classes = {} // define list in child class

  static checkIdInObj = function (id, obj = {}) {
    // takes string or object with id prop
    id = id || { id: id }
    id = id.id || id
    return (id in obj)
  }

  addUniqueObjToSubset (a) {
    // a: { obj, id, subset, unique, classes }
    a = a || {}

    a.obj = a.obj || {}
    a.id = a.id || a.obj.id || gen.next().value
    a.unique = !(a.unique === false) // true
    a.classes = a.classes || NamedSet._classes

    var Cls = a.classes[a.obj.clsName] || NamedSet

    if ((a.subset in this._subsets)) {
      a.id = a.obj.id || a.id
      if (a.unique) {
        while (NamedSet.checkIdInObj(a.id, this[a.subset])) {
          a.id += gen.next().value
        }
      }
      a.obj.id = a.id

      this[a.subset][a.id] = new Cls(a.obj)

      // _subsets[subset] -- properties
      if (this._subsets[a.subset].mapGetters) {
        Object.defineProperty(this, a.id, {
          get: () => { return this[a.subset][a.id] },
          set: (v) => { this[a.subset][a.id] = v },
          enumerable: false
        })
      }
      if (this._subsets[a.subset].hideAll) {
        this[a.subset][a.id].hide = true
      }
      return true
    } else { return false }
  }

  _mapSettings (s) {
    // map this.settings to this
    this.settings = s || this.settings || {}
    for (const ts in this.settings) {
      Object.defineProperty(this, ts, {
        get: () => { return this.settings[ts] },
        set: (v) => { this.settings[ts] = v },
        enumerable: false
      })
    }
  }

  _setSettings (s, clsConf = {}) {
    // merge and/or set defaults
    // also copy settings properties from another instance
    s = s || {}
    var ss = s.settings || {}

    clsConf.defaultSettings = clsConf.defaultSettings || {
      title: this.id || 'NamedSet'
    }

    const merge = (k, dflt) => {
      if ((ss[k] === 0) || (s[k] === 0)) {
        this.settings[k] = 0
      } else {
        this.settings[k] = ss[k] || s[k] || this.settings[k] || dflt
      }
    }
    for (const ds in clsConf.defaultSettings) {
      merge(ds, clsConf.defaultSettings[ds])
    }

    if (clsConf.mapSettings) {
      this._mapSettings()
    }
  }

  constructor (obj, clsConf) {
    obj = obj || {}
    obj.settings = obj.settings || obj
    obj.clsName = obj.clsName || 'NamedSet'
    this.clsName = obj.clsName

    this.id = obj.id || 'set'

    clsConf = clsConf || {}
    clsConf.mapSettings = !(clsConf.mapSettings === false) // true
    clsConf.classes = clsConf.classes || NamedSet._classes
    clsConf.subsets = clsConf.subsets || {}
    clsConf.defaultSettings = clsConf.defaultSettings || {}

    this.settings = this.settings || {}
    this.settings.hide = this.settings.hide || false
    this._setSettings(obj, clsConf)

    this._subsets = clsConf.subsets

    Object.entries(this._subsets).forEach(([k, v]) => {
      this[k] = {}
      obj[k] = obj[k] || v.default || {}
      for (const item in obj[k]) {
        // unique: false -- overwrite
        this.addUniqueObjToSubset({
          obj: obj[k][item],
          id: item,
          subset: k,
          unique: false,
          classes: clsConf.classes
        })
      }
    })
  }
}


// // Get the item by ID
// const item = mySet.items['item-2']


// // Check if the item exists
// const exists = NamedSet.checkIdInObj('item-2', mySet.items);
