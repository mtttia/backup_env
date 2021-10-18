const { ipcRenderer } = require('electron')

function trySpeackToHome(){
    ipcRenderer.send('say-stop', '')
}

module.exports = {
    sayStop: trySpeackToHome
}