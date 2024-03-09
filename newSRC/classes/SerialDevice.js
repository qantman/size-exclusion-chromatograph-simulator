const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const arrToObj = require("arrToObj")
class SerialDevice {

  _standatrPortLIN = {path: '/dev/ttyUSB0', baudRate: 9600 , dataBits: 8, parity: 'none', stopBits: 1, autoOpen: true}
  _standartPortWIN = {path: 'COM4', baudRate: 9600 , dataBits: 8, parity: 'none', stopBits: 1, autoOpen: true}

  constructor(port){
    if(!port){
      this._port = this._standartPortWIN
    }else{
      this._port = port
    }
    this._id = 0
    this.isOpen = false
  }

  newConnection(){
    return new Promise((resolve, reject) => {
      let reconnect = setInterval(() => {
        SerialPort.list().then(list => {
          for(let i = 0; i < list.length; i++){
            if(list[i].path == this._port.path){
              this._serialport = new SerialPort(this._port)
              this._parser = this._serialport.pipe(new ReadlineParser({ delimiter: '\r\n' }))
              this.isOpen = true
              clearInterval(reconnect)
              resolve(this.isOpen)
              break
            }else {
              reject({"Error" : "Device not found"})
            }
          }
        })
      }, 1000)
    })
  }

  readData(){
    return new Promise((res) => {
      try{
        this._parser.on("data", (data) => {
          this.data = arrToObj(data.split(";"))
          res(this.data)
        })
      }catch(e){
        throw new Error(e)
      }
    })
  }

  writeData(str){
    this._serialport.write(str)
  }

  startReadLoop(ms){
    return new Promise((res) => {
      if(!ms) {
        this.ms = 1000
      }
      else {
        this.ms = ms
      }
      return setInterval(async() => {
        res(await this.readData())
      }, ms)
    })
  }

  stopReadLoop(){
    clearInterval(this.startReadLoop)
  }
  
}

module.exports = SerialDevice

