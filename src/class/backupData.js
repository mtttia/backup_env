const { readFileSync, existsSync, writeFileSync } = require('fs')
const path = require('path')
const Log = require('./log')

const logsPath = path.join(__dirname, '../logs.json')

class BackupData {
  Logs;
  constructor(logs, save = false) {
    this.Logs = logs
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

module.exports = BackupData