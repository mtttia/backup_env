const { readFileSync, existsSync, writeFileSync } = require('fs')
const path = require('path')

const settingPath = path.join(__dirname, '../setting.json')

class Setting{
    CronPattern; // "* * * * *" -> see documentation here https://www.npmjs.com/package/node-cron+ù
    SrcFolder;
    DistFolder;
    WinBakcup;

    constructor(cronPattern, srcFolder, distFolder, winBakcup,save = false){
        this.CronPattern = cronPattern
        this.SrcFolder = srcFolder
        this.DistFolder = distFolder
        this.WinBakcup = winBakcup
        if (save)
            this.save()
    }

    static fromJson(obj) {
        if(obj.CronPattern && obj.SrcFolder && obj.DistFolder)
            return new Setting(obj.CronPattern, obj.SrcFolder, obj.DistFolder, obj.WinBakcup, false)
        else
            throw new Error('Object is not a Setting object')
    }

    static load(){
        let obj = JSON.parse(readFileSync(settingPath, {encoding:'utf-8'}))
        return this.fromJson(obj)
    }

    static firstTime(){
        return !existsSync(settingPath)
    }

    save() {
        writeFileSync(settingPath, JSON.stringify(this))
    }
}

module.exports = Setting