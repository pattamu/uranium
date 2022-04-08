const today = new Date()

const getBatchInfo = () => {
    console.log(`Uranium, W3D3, the topic for today is Nodejs module system`)
}

const missing = (arr) => {
const len = arr.length;
const sum = ((arr[len-1]) * (1 + arr[len - 1])) / 2 - ((arr[0]-1) * (1 + (arr[0]-1))) / 2
const result = sum  - arr.reduce((x,y) => x + y);    
return [result] // i did this beacuse I can't send a single value through res.send() so i put the value inside an array and sent it
}
module.exports = {getBatchInfo, today, missing}

