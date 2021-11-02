const { readFileSync, existsSync, writeFileSync } = require('fs')
const path = require('path')
const Log = require('./log')

const logsPath = path.join(__dirname, '../logs.json')

class BackupData {
  Logs;
  constructor(logs, save = false) {
    this.Logs = logs
    this.Logs.sort((el1, el2) => {
      let date1 = new Date(getUnixString(el1.Date, el1.StartHour))
      let date2 = new Date(getUnixString(el2.Date, el2.StartHour))

      return date1 < date2 ? 1 : date1 == date2 ? 0 : -1
    })
    if(save) this.save()
  }

  static fromJson(obj) {
    if(obj.Logs)
      return new BackupData(obj.Logs, false)
    else
      throw new Error('Object is not a BackupData object')
  }

  static create() {
    return new BackupData([], true) 
  }

  static load(){
    let obj = JSON.parse(readFileSync(logsPath, {encoding:'utf-8'}))
    return this.fromJson(obj)
  }

  static exist(){
    return existsSync(logsPath)
  }

  save() {
    writeFileSync(logsPath, JSON.stringify(this))
  }

  addLog(log, {save}) {
    if (Log.isLog(log)) {
      this.Logs.push(log)
      if (save) {
        this.save()
      }
    }
    else {
      throw new Error('this is not a log')
    }
  }

  upload() {
    let n = BackupData.load()
    this.Logs = n.Logs
  }
}

function getUnixString(date, time) {
  date = date.split('/')
  //0 -> day, 1 -> month, 2 -> year
  time = time.split(':')
  //0 -> hour, 1 -> minutes

  return `${date[2]}-${date[1]}-${date[0]}T${time[0]}:${time[1]}:00`
}

module.exports = BackupData