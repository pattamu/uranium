const players = [{
        name: "manish",
        dob: "01/01/1995",
        gender: "male"
    },{
        name: 'gopal',
        dob: '01/09/1995',
        gender: 'male',
        city: 'delhi'
    },{
        name: 'lokesh',
        dob: '01/02/1992',
        gender: 'male',
        city: 'mumbai',
    }
]

const control = (req, res) => {
    const newName = req.body.name
    for(let i=0; i<players.length; i++){
        if(players[i].name === newName){
            res.send({message: "Player '" + newName + "' already exist in the list"}) 
            return
            //if 'return' is not written even if the res.send() fire the response and close the connection the code still 
            //runs from the next line untill the function is completed and hence the data printed mismatchs the predicted output
            // For example, if I give {name: "gopal"} then it'll print the message "Player exits" and yet still continue to run
            //the below code which will push the player again in the list. So now I've 2 'gopal' in the list. But if I send 'gopal'
            //again by post request it'll check the loop, it'll send the responce 'Player exits' for the 1st time and check again and will find 
            //another 'gopal' and if condition will be true again but this time there is nothing to send as res.send() won't work now and 
            //the programs will be stuck here because the if condition is true but it has nothing to ececute inside if.
        }
    }
    players.push(req.body)
    res.send(players)
}

const control2 = (req, res) => {
    const {name} = req.body
    let flag = false
    for(let i=0; i<players.length; i++){
        if(players[i].name === name){
            flag = true
            res.send({message: "Player '" + name + "' already exist in the list"})
        }
    }
    if(!flag){
    players.push(req.body)
    res.send(players)
    }
}

const control3 = (req, res) => {
    const newName = req.body.name
    // res.send((typeof(players.find(x => x.name === newName)) === "undefined") ? 
    //             (players.push(req.body) && {players}) : {message: "Player '" + newName + "' already exist in the list"})

    //we can use the below method using some() method as well. So above and below method will work fine
    
    res.send(!players.some(x => x.name === newName) ? 
                (players.push(req.body) && {players}) : {message: "Player '" + newName + "' already exist in the list"})
    console.log(req.body)
}

//The below version of the code chekcks the name even if some letters in the name have capital or small letter. Like in the list 'gopal'
//is present, but if I try to add 'Gopal' or 'GOpal' or 'gopal', it'll still show that the player already exists.
const control4 = (req, res) => {
    const newName = req.body.name.toUpperCase()    
    res.send(!players.some(x => x.name.toUpperCase() === newName) ? 
                (players.push(req.body) && {players}) : {message: "Player '" + req.body.name + "' already exist in the list"})
}

//The below version of the code will check if the name exist and if yes does it has gender property and if yes add the name if the gender 
//is different. If gender property is not there then add the name only if the name doesn't exit in the list
const control5 = (req, res) => {
    const newName = req.body.name.toUpperCase()    
    if(req.body.gender)
    res.send(players.some(x => x.name.toUpperCase() === newName && x.gender.toUpperCase()  === req.body.gender.toUpperCase() ) ? 
                {message: "Player '" + req.body.name + "' with similar gender already exist in the list"} : (players.push(req.body) && {players}) )
    else
    res.send(players.some(x => x.name.toUpperCase() === newName) ? 
                {message: "Player '" + req.body.name + "' already exist in the list"} : (players.push(req.body) && {players}) )
}

module.exports = {control, control2, control3, control4, control5}