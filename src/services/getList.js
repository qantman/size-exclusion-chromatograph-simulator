const Device = require("./../classes/Devices")
function loopList(){
    setInterval(() => {
        Device.list().then(res => {
            Device.cashList = {list: res}
        }) 
    }, 500)
}
module.exports = loopList