const bootstrap = require('bootstrap')
const Setting = require('../class/setting')
const { ipcRenderer, remote } = require('electron')
const dialog = remote.dialog;

let setting = Setting.firstTime() ? null : Setting.load();

if(!setting){
    let w = remote.getCurrentWindow()
    w.close()
}
else{
    document.getElementById('txtSrc').value = setting.SrcFolder
    document.getElementById('txtDist').value = setting.DistFolder
}

document.getElementById('browseSrc').addEventListener('click', async()=>{
    document.getElementById('txtSrc').value = (await dialog.showOpenDialog({ properties: ['openDirectory'] })).filePaths[0] || ""
})

document.getElementById('browseDist').addEventListener('click', async()=>{
    document.getElementById('txtDist').value = (await dialog.showOpenDialog({ properties: ['openDirectory'] })).filePaths[0] || ""
})

document.getElementById('btn-open-app').addEventListener('click', () => {
    ipcRenderer.send('open-app', '')
})

document.getElementById('btn-save-change').addEventListener('click', () => {
    changeFolder()
    let w = remote.getCurrentWindow()
    w.close()
})

function changeFolder() {
    let src = document.getElementById('txtSrc').value
    let dist = document.getElementById('txtDist').value
    setting.SrcFolder = src
    setting.DistFolder = dist
    setting.save()
    ipcRenderer.send('save-change', '')
}

document.getElementById('btn-retray').addEventListener('click', (event, arg) => {
    changeFolder()
    ipcRenderer.send('retray-backup', '')
    document.getElementById('report').classList.add('d-none')
    document.getElementById('report-loading').classList.remove('d-none')
})
ipcRenderer.on('retray-backup-log', (event, arg) => {
    document.getElementById('report-loading').classList.add('d-none')
    document.getElementById('report').classList.remove('d-none')
    document.getElementById('report').innerHTML = `
    <h3>Report</h3>
    <p>
        Data: ${arg.Date}<br>
        Ora inizio: ${arg.StartHour}<br>
        Ora fine: ${arg.EndHour}<br>
        Stato: ${arg.State}<br>
        Descrizione: ${arg.Description}<br>
        Src: ${arg.SrcFolder}<br>
        Dist: ${arg.DistFolder}
    </p>
    `
})