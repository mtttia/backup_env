const { readFileSync, existsSync } = require('fs')
const path = require('path')

const settingPath = path.join(__dirname, 'setting.json')

class Setting{
    CronPattern; // "* * * * *" -> see documentation here https://www.npmjs.com/package/node-cron

    constructor(cronPattern){
        this.CronPattern = cronPattern
    }

    static fromJson(obj){
        CronPattern = obj.CronPattern
    }

    static load(){
        let obj = JSON.parse(readFileSync(settingPath, {encoding:'utf-8'}))
        return this.fromJson(obj)
    }

    static firstTime(){
        return !existsSync(settingPath)
    }
}

module.exports = Setting