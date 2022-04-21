const headerCheck = async (req, res, next) => {
    const header = req.headers.isfreeappuser || req.headers.isFreeAppUser //some client send header as it is and some with lowercase so thi checks both our conditions
    if(header){
        if(header === "true")
        req['isFreeAppUser'] = Boolean(header)  //5,6,7 all are different ways to assign Boolean value
        // req['isFreeAppUser'] = true //we can do 'req.isFreeAppUser = true' as well. same thing
        // req['isFreeAppUser'] = JSON.parse(header)
        if(header === "false")
        req['isFreeAppUser'] = false //in [] notation the value is considered to be a variable that's why we write the 'isFreeAppUser' with single/double quote to make it a string 
    next()
    }
    else res.send({msg: "An usefull header is missing"})
}

module.exports = {headerCheck}