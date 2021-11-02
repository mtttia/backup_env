const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const BackupData = require('./class/backupData')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

//backupData
let backupData = BackupData.exist() ? BackupData.load() : BackupData.create()

//from mainwindow

ipcMain.on('say-upload-setting', (event, arg) => {
  workerWindow.webContents.send('upload-setting', '')
})

ipcMain.on('say-start-backup', (event, arg) => {
  workerWindow.webContents.send('start-backup', '')
})

ipcMain.on('say-pause-backup', (event, arg) => {
  workerWindow.webContents.send('pause-backup', '')
})

ipcMain.on('say-resume-backup', (event, arg) => {
  workerWindow.webContents.send('resume-backup', '')
})

ipcMain.on('say-status', (event, arg) => {
  workerWindow.webContents.send('status', '')
})

ipcMain.on('ask-recup', (event, arg) => {
  workerWindow.webContents.send('initial-status', '')
})

ipcMain.on('say-new-backup', (event, arg) => {
  workerWindow.webContents.send('new-backup', arg)
})

//from workerwindow

ipcMain.on('error', (event, arg) => {
  mainWindow.webContents.send('error', ...arg)
})

ipcMain.on('folder-error', (event, arg) => {  
  showFolderError()
})

ipcMain.on('log', (event, arg) => {
  saveLog(arg)
  mainWindow.webContents.send('log', arg)
})

ipcMain.on('status-reply', (event, arg) => {
  mainWindow.webContents.send('status', arg)
})

ipcMain.on('initial-status-reply', (event, arg) => {
  mainWindow.webContents.send('config', arg)
})

ipcMain.on('new-backup-end', (event, arg) => {
  mainWindow.webContents.send('new-backup-end', arg)
})


let mainWindow = null, workerWindow = null, folderErrorWindow = null
let mainClosed = true

const createWindow = () => {  
  createMainWindows()
  createWorkerWindows()  
};

const createMainWindows = () => {
  mainWindow = new BrowserWindow({
    minWidth : 800,
    minHeight : 300,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'client/index.html'));
  mainClosed = false
  mainWindow.addListener('closed', (e)=>{
    mainClosed = true
  })
}

const createWorkerWindows = () => {
  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  workerWindow.loadFile(path.join(__dirname, 'background/index.html'))
}

const createFolderErrorWindows = () => {
  folderErrorWindow = new BrowserWindow({
    minWidth : 550,
    minHeight : 300,
    width: 550,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  folderErrorWindow.loadFile(path.join(__dirname, 'client/folderError.html'))
}

const gotTheLock   = app.requestSingleInstanceLock()

try{
  if (!gotTheLock) {  
    app.on('ready', () => {
      app.quit()
    })
    
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainClosed) {        
        createMainWindows()
      }
      if(mainWindow){
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
      if(workerWindow.isDestroyed()){
        createWorkerWindows()
      }
    })
  
    app.on('ready', createWindow);
  
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  
    app.on('activate', () => {  
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  }
}catch(ex){
  console.log(ex);
}

function showFolderError() {
  if (folderErrorWindow) {
    if (folderErrorWindow.isMinimized()) folderErrorWindow.restore()
    folderErrorWindow.focus()
  }
  createFolderErrorWindows()
}

function saveLog(log) {
  backupData.addLog(log, {save:true})
}