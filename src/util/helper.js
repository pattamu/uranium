const today = new Date()

const printDate = ()=>{
    console.log("Today's date is: " + today.getDate())
}

const printMonth = ()=>{
    console.log("Current month is: " + Number(today.getMonth()+1))
}

const getBatchInfo = () => {
    console.log(`Uranium, W3D3, the topic for today is Nodejs module system & npm packages`)
}

module.exports = {printDate, printMonth, getBatchInfo}