const axios = require('axios')

const getVaccSessions = async (req, res) => {
    try{
        let val1 = req.query.district_id
        let val2 = req.query.date
        let fetch = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${val1}&date=${val2}`
        }
        let result = await axios(fetch)
        res.status(200).send({msg: result.data})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const getWeatherdata = async (req, res) => {
    try{
        let cities =  req.body.cities || ["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
        if(req.query.city){
            let fetch = {
                method: 'get',
                url: `http://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=e797d9bca8783a24db6c83527420eba4`
            }
            let result = await axios(fetch)
            return res.status(200).send({Tempeature: result.data.main.temp})
        }
        let result = []
        for(let i in cities){
            let fetch = `http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=e797d9bca8783a24db6c83527420eba4`
            let val = (await axios.get(fetch)).data.main
            result.push({city: cities[i], temp: val.temp})
        }
        result.sort((a,b) => {return a.temp - b.temp})
        res.status(200).send({msg: result})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

const getMemes = async (req, res) => {
    try{
        let id = req.query.template_id
        let text0 = req.query.text0
        let text1 = req.query.text1
        let user = req.query.username 
        let pass = req.query.password
        let fetch = {
            method: 'post',
            url: `https://api.imgflip.com/caption_image?template_id=${id}&text0=${text0}&text1=${text1}&username=${user}&password=${pass}`
        }
        let result = await axios(fetch)
        res.status(200).send({msg: result.data})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}

module.exports = {getVaccSessions, getWeatherdata, getMemes}
