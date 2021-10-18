const cron = require('node-cron')
const { ipcRenderer } = require('electron')

let i = 0

let task = cron.schedule('*/2 * * * * *', () => {
  ipcRenderer.send('print', 'i\'m running ' + i++)
})

task.start()

ipcRenderer.on('stop-cron', (event, arg) => {
  ipcRenderer.send('print', 'I should stop')
  task.stop()  
})
