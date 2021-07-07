const mongoose = require('mongoose')
const SunningSchema = new mongoose.Schema({
    "month": {
        type: String
    },
    "color": {
        type: String,
        default: '#fff'
    },
    "icon": {
        type: String,
        default: ''
    },
    // 当前月份下的sunnings
    "activities": {
        type: Array,
        default: []
    }
})
module.exports = mongoose.model('Sunning', SunningSchema)
