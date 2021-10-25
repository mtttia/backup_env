const cron = require('node-cron')
const copyDir = require('./backup')
const { existsSync } = require('fs')
const { ipcRenderer } = require('electron')
const Setting = require('./../class/setting')
const Log = require('./../class/log')

let setting = null
let task = null
let running = false

ipcRenderer.on('upload-setting', (event, arg) => {
  setting = Setting.load()
  ipcRenderer.send('logger', setting)
})

ipcRenderer.send('logger', 'logger work')

ipcRenderer.on('start-backup', (event, arg) => {
  if (task) {
    task.stop()
  }
  task = cron.schedule(setting.CronPattern, cronFunction)
  task.start()
  ipcRenderer.send('logger', 'start task', setting.CronPattern)
  running = true
})

ipcRenderer.on('stop-backup', (event, arg) => {
  if (task)
    task.stop()
})

async function cronFunction() {  
  ipcRenderer.send('logger', 'cron jobs works')
  console.log(setting.SrcFolder,setting.DistFolder);
  if (existsSync(setting.SrcFolder) && existsSync(setting.DistFolder)) {
    let report = new Log();
    let today = new Date()
    report.Date = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`
    report.DistFolder = setting.DistFolder
    report.SrcFolder = setting.SrcFolder
    report.StartHour = `${today.getHours()}:${today.getMinutes()}`
    try {      
      await copyDir(setting.SrcFolder, setting.DistFolder)
      let now = new Date()
      report.EndHour = `${now.getHours()}:${now.getMinutes()}`
      report.Description = "" 
      report.State = 'OK'
    } catch (ex)
    {
      let now = new Date()
      report.EndHour = `${now.getHours()}:${now.getMinutes()}`
      report.State = 'Errore'
      report.Description = 'Errore durante la copia delle cartelle'//lang: ITA
      //TODO: ERROR HERE
    }
    ipcRenderer.send('log', report)
  }
  else {
    //send error
    ipcRenderer.send('error', 'no-directory')
    let report = new Log();
    let today = new Date()
    report.Date = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`
    report.Description = "Cartelle non trovate" //lang: ITA
    report.DistFolder = setting.DistFolder
    report.SrcFolder = setting.SrcFolder
    report.State = 'Errore'
    report.StartHour = `${today.getHours()}:${today.getMinutes()}`
    report.EndHour = `${today.getHours()}:${today.getMinutes()}`
    ipcRenderer.send('log',report)
  }
  
}