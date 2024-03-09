const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline');
const arrToObj = require("arrToObj");
class SerialDevice {
  _standartPortForLin = {path: '/dev/ttyUSB0', baudRate: 9600 , dataBits: 8, parity: 'none', stopBits: 1, autoOpen: true}
  _standartPortForWib = {path: 'COM3', baudRate: 9600 , dataBits: 8, parity: 'none', stopBits: 1, autoOpen: true}
  constructor(port) {
    this.createNewSerialConnection = new Promise(async (resolve, reject) => {
      let connect = setInterval(() => {
        if(!port){
          this.port = {path: '/dev/ttyUSB0', baudRate: 9600 , dataBits: 8, parity: 'none', stopBits: 1, autoOpen: true}
        }else{
          this.port = port
        }
        this.path = this.port.path
        this._cashADS = new Object
        this._cashList = new Object
        SerialPort.list().then(list => {
          this._list = list
          return list
        })
        .then(list => {
          for(let i = 0; i < list.length; i++){
            if(list[i].path == this.path){
              this.serialport = new SerialPort(this.port)
              this.parser = this.serialport.pipe(new ReadlineParser({ delimiter: '\r\n' }))
              resolve(this.parser)
              clearInterval(connect)
              break
            }else {
              reject({"Error" : "Device not found"})
            }
          }
        })
      }, 1000)
    })
  }

  static set cashADS(value){
    this._cashADS = value
  }
  static get cashADS(){
    return this._cashADS
  }

  static set cashList(value){
    this._cashList = value
  }
  static get cashList(){
    return this._cashList
  }

  _SerialRead(parser){
    return new Promise((res, rej) => {
      try{
        parser.on("data", (data) => {
          res(data.split(";"))
        })
      }catch(e){
        rej()
      }
    })
  }
  _SerialWrite(serialport, str) {
    serialport.write(str)
  }

  startLoopReadADS(parser){
    this._loopADS = setInterval(() => {
      this._SerialRead(parser).then(data => {
          this.cashADS = {
            "Serial read": {
              path: this.path,
              I2CHub: arrToObj(data)
            }
          }
      })
    }, 750)
  }

  stopLoopReadADS(){
    clearInterval(this._loopADS)
  }

  startLoopReadList(){
    this._loopList = setInterval(() => {
      SerialPort.list().then(list => {
        this.cashList = {"Serial Device" : list}
      })
    }, 2000)
  }

  stopLoopGetList(){
    clearInterval(this._loopList)
  }
  
}
module.exports = SerialDevice

