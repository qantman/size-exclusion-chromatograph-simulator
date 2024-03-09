const NamedSet = require('./NamedSet')

const OrderedSet = class OrderedSet extends NamedSet {
  setOrder (order, subset) {
    this._order = this._order || {}
    var o = this._order[subset]
    order = order || {}
    order = order._order || order || {}
    if (Array.isArray(order[subset])) {
      o = order[subset]
    } else { o = o || [] }

    // clean order
    o.forEach((k) => {
      if (!(k in this[subset])) {
        o.splice(o.indexOf(k), 1)
      }
    })
    // complete order
    Object.keys(this[subset]).forEach((k) => {
      if (o.indexOf(k) === -1) { o.push(k) }
    })
  }

  hideToEnd (id, subset) {
    id = id || { id: id }
    id = id.id || id
    this[subset] = this[subset] || {}
    var obj = this[subset][id] || { settings: {} }
    this._order = this._order || {}
    var o = this._order[subset]
    if (NamedSet.checkIdInObj(id, this[subset]) && !obj.hide) {
      o.push(o.splice(o.indexOf(id), 1)[0])
    }
  }

  addUniqueObjToSubset (a) {
    // a: { obj, id, subset, unique, classes, order }
    a = a || {}
    var res = NamedSet.prototype.addUniqueObjToSubset.call(this, a)
    this.setOrder(a.order, a.subset)
    return res
  }

  constructor (obj, clsConf) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'OrderedSet'
    super(obj, clsConf)

    this._order = obj._order || this._order || {}
    Object.keys(this._subsets).forEach((subset) => {
      this._order[subset] = this._order[subset] || []
      this.setOrder(this._order[subset], subset)
    })
  }
}

module.exports = OrderedSet
