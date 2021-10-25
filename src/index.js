const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

//from mainwindow

ipcMain.on('say-upload-setting', (event, arg) => {
  workerWindow.webContents.send('upload-setting', '')
  console.log('upload-setting');
})

ipcMain.on('say-start-backup', (event, arg) => {
  workerWindow.webContents.send('start-backup', '')
  console.log('start-backup');
})

ipcMain.on('say-stop-backup', (event, arg) => {
  workerWindow.webContents.send('stop-backup', '')
})

//from workerwindow

ipcMain.on('error', (event, arg) => {
  mainWindow.webContents.send('error', ...arg)
})

ipcMain.on('log', (event, arg) => {
  mainWindow.webContents.send('log', arg)
})

ipcMain.on('logger', (event, arg) => {
  // console.log();
})


let mainWindow, workerWindow

const createWindow = () => {  
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

  workerWindow = new BrowserWindow({
    show: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  workerWindow.loadFile(path.join(__dirname, 'background/index.html'))

  // mainWindow.webContents.openDevTools();
};

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