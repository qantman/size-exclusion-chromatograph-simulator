const express = require("express")
const router = express.Router()
const urlencodedParser = express.urlencoded({extended: false})
const SerialDevice = require("../src/classes/SerialDevice")
let arduino = new SerialDevice()
arduino.createNewSerialConnection.then(parser => {
    
    arduino.startLoopReadADS(parser)
    arduino.startLoopReadList()
}, rej => {
    console.log(rej)
})


router.get("/", (req, res) => {
    res.json(Object.assign(arduino.cashADS, arduino.cashList))
})

router.get("/list", (req, res) => {
    Device.list().then(list => {
        res.json(list)
    })
})

router.get("/dac", (req, res) => {
    res.render("dac")
})


router.post("/dac", urlencodedParser, (req, res) => {

})

module.exports = router