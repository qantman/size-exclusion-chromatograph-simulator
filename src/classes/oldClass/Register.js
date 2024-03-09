const Register = class Register {
  constructor (obj, id) {
    obj = obj || {}
    this.clsName = obj.clsName || 'Register'
    this.id = id || obj.id || 'reading'
    this.addr = obj.addr

    this.type = (obj.type === 0) ? 0 : obj.type || 2
    // 0 -- bool, 1 -- integer, 2 -- float
    if ((this.type === 0) || (this.type === 'bool')) {
      this.val = obj.val || false
    } else {
      this.val = obj.val || 0
      this.units = obj.units || 'units'
      this.digits = obj.digits || 0
      this.linear = obj.linear || {
        slope: 1,
        inter: 0
      }
    }
  }

  get transformedVal () {
    if ((this.type === 0) || (this.type === 'bool')) {
      return !!this.val
    }
    if (isNaN(Number(this.val))) {
      return this.val
    }
    let l = this.linear || {}
    return (Number(this.val) * (l.slope || 1) + (l.inter || 0))
      .toFixed(this.digits)
  }

  set transformedVal (x) {
    // if (this.type === 0) {
    //   console.log('val', this.val, 'type', this.type,
    //     'transformedVal', this.transformedVal, 'x', x, 'addr', this.addr, this.id)
    // }
    if ((this.type === 0) || (this.type === 'bool')) {
      this.val = !!x
    }
    if (isNaN(Number(x))) {
      this.val = x
    }
    let l = this.linear || {}
    this.val = (Number(x) - (l.inter || 0)) / (l.slope || 1)
  }
}

module.exports = Register
