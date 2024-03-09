const Register = require('./Register')

const IskraRegister = class IskraRegister extends Register {
  constructor (obj, id) {
    obj = obj || {}
    obj.clsName = obj.clsName || 'IskraRegister'
    super(obj, id)
  }
}

module.exports = IskraRegister
