const today = new Date()

const getBatchInfo = () => {
    console.log(`Uranium, W3D3, the topic for today is Nodejs module system`)
}

const missing = (arr) => {
const len = arr.length;
const sum = ((arr[len-1]) * (arr[len - 1]) + 1) / 2 - ((arr[0]-1) * (1 + (arr[0]-1))) / 2
const result = sum  - arr.reduce((x,y) => x + y);   
return [result] // i did this beacuse I can't send a single value through res.send() so i put the value inside an array and sent it
}

const a = [33,34,35,36,37,39,40,41,42]
const b = [1,2,3,4,6,7,8,9]
const c = [20,21,30,31,34,35,40]

const findMissing = (req,res) => {
    res.send(mis(c))
}

const mis = (arr) => {
    const l = arr.length
    const temp = arr[0]
    const misArr = []
    for(let i=0; i<(arr[l-1]-arr[0]+1); i++){
        if(arr.indexOf(temp + i) === -1) misArr.push(temp+i)
    }
    return misArr
}

module.exports = {getBatchInfo, today, missing, findMissing}

