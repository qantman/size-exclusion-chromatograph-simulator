const SerialDevice = require("./SerialDevice")
const { SerialPort } = require('serialport')
class SerialRegisters {

    constructor(){
        this.devices = []
        this.data = []
    }

    list() {
        return SerialPort.list()
    }

    addDevice(device){
        this.devices.push(device)
    }

    readDataFromDevice(deviceNumber){
        return new Promise(async(resolve, reject) => {
            let device = this.devices[deviceNumber]
            if(device.isOpen == true){
                resolve(await device.readData())
            }else{
                let bool = await device.newConnection()
                if(bool == true){
                    resolve(await device.readData())
                }
            } 
        })
    }

    readAll(){
        return new Promise(async(res) => {
            for(let i = 0; i < this.devices.length; i++){
                let data = await this.readDataFromDevice(i)
                this.data.push(await this.readDataFromDevice(i))
            } 
            res(this.data)
        })
    }

    writeDataFromDevice(deviceNumber, str){
        let device = this.devices[deviceNumber]
        device.writeData(str)
    }

    writeAll(obj){
        //Парсинг объекта в строку для всех устройств

        for(let i = 0; i < this.devices.length; i++){
            this.writeDataFromDevice(i, obj)
        } 
    }


    deleteDevice(device){
        this.devices.pop(device)
    }

}
let asd = new SerialRegisters

module.exports = SerialRegisters

