const cron = require('node-cron')
const copyDir = require('./backup')
const { existsSync } = require('fs')
const { ipcRenderer } = require('electron')
const Setting = require('./../class/setting')
const Log = require('./../class/log')

let setting = null
let task = null
let running = false
let pause = false

ipcRenderer.on('upload-setting', (event, arg) => {
  setting = Setting.load()
  ipcRenderer.send('logger', setting)
})


ipcRenderer.on('start-backup', (event, arg) => {
  if (task) {
    task.stop()
    task.removeAllListeners()  
  }
  task = cron.schedule(setting.CronPattern, cronFunction)
  
  task.start()
  
  running = true
})

ipcRenderer.on('pause-backup', (event, arg) => {  
  pause = true
})

ipcRenderer.on('resume-backup', (event, arg) => {
  pause = false
})

ipcRenderer.on('status', (event, arg) => {
  ipcRenderer.send('status-reply', {running:running, pause:pause})
})

ipcRenderer.on('initial-status', (event, arg) => {
  ipcRenderer.send('initial-status-reply', {running:running})
})

ipcRenderer.on('new-backup', async (event, arg) => {  
  let report = await backup(arg)
  ipcRenderer.send('log', report)
  ipcRenderer.send('new-backup-end', report)
})

async function backup(arg) {
  if (existsSync(arg.SrcFolder) && existsSync(arg.DistFolder)) {
    let report = new Log();
    let today = new Date()
    report.Date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
    report.DistFolder = arg.DistFolder
    report.SrcFolder = arg.SrcFolder
    report.StartHour = `${today.getHours()}:${today.getMinutes()}`
    try {      
      await copyDir(arg.SrcFolder, arg.DistFolder)
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
      ipcRenderer.send('generic-error', '')
      console.log(ex);
    }
    return report
    
  }
  else {
    //send error
    ipcRenderer.send('error', 'no-directory')
    let report = new Log();
    let today = new Date()
    report.Date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
    report.Description = "Cartelle non trovate" //lang: ITA
    report.DistFolder = arg.DistFolder
    report.SrcFolder = arg.SrcFolder
    report.State = 'Errore'
    report.StartHour = `${today.getHours()}:${today.getMinutes()}`
    report.EndHour = `${today.getHours()}:${today.getMinutes()}`
    return report
  }
}

async function cronFunction() {  
  if (pause) return
  
  ipcRenderer.send('logger', 'cron jobs works')
  console.log(setting.SrcFolder,setting.DistFolder);
  if (existsSync(setting.SrcFolder) && existsSync(setting.DistFolder)) {
    let report = new Log();
    let today = new Date()
    report.Date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
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
      ipcRenderer.send('error', ex)
    }
    ipcRenderer.send('log', report)
  }
  else {
    //send error
    ipcRenderer.send('error', 'no-directory')
    ipcRenderer.send('folder-error', '')
    let report = new Log();
    let today = new Date()
    report.Date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
    report.Description = "Cartelle non trovate" //lang: ITA
    report.DistFolder = setting.DistFolder
    report.SrcFolder = setting.SrcFolder
    report.State = 'Errore'
    report.StartHour = `${today.getHours()}:${today.getMinutes()}`
    report.EndHour = `${today.getHours()}:${today.getMinutes()}`
    ipcRenderer.send('log',report)
  }  
}

ipcRenderer.on('retray-backup', async (event, arg) => {
  setting = Setting.load()
  let report = await backup({
    SrcFolder: setting.SrcFolder,
    DistFolder: setting.DistFolder
  })
  ipcRenderer.send('log', report)
  ipcRenderer.send('retray-backup-log', report)
})