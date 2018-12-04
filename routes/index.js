var express = require('express');
var router = express.Router();
let mongo = require('monk')(process.env.DB);
let status = mongo.get('status');
let front = mongo.get('front');
let back = mongo.get('back');

router.get('/status', async function (req, res, next) {
    try {
        res.send(await getStatus())
    }catch(err){
        console.log(err);
    }
});

router.post('/status', async (req, res, next)=>{
    try {
        let statusvalue = await getStatus();
        console.log(statusvalue)
        if (statusvalue){
            status.findOneAndUpdate({'name': 'status'}, {'name': 'status', value: req.body.status})
        }else {
            status.insert({'name': 'status', value: req.body.status});
        }
    }catch(err){
        console.log(err)
    }finally {
        res.send()
    }
});


router.post('/front', function (req, res, next){
    req.body.data.token = req.body.token;
    front.insert(req.body.data);
    res.send()
});
router.post('/back', function (req, res, next){
    back.insert(req.body);
    res.send()
});

async function getStatus(){
    try {
        let data = await status.findOne({name: 'status'}, 'value');
        if (data) {
            return data.value
        }else {
            return data
        }
    }catch(err){
        return Promise.reject(err)
    }
}

module.exports = router;
