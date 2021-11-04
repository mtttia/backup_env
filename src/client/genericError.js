const Bootstrap = require('bootstrap')
const { ipcRenderer } = require('electron')

document.getElementById('btn-gotoHome').addEventListener('click', () => {
  ipcRenderer.send('to-error-from-home', '')
})