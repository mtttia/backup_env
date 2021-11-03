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
    document.getElementById('txtSrc').value = (await dialog.showOpenDialog({ properties: ['openDirectory'] })) || ""
})

document.getElementById('browseDist').addEventListener('click', async()=>{
    document.getElementById('txtDist').value = (await dialog.showOpenDialog({ properties: ['openDirectory'] })) || ""
})
