const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

ipcMain.on('say-stop', (event, arg) => {  
  try {
    workerWindow.webContents.send('stop-cron', '')
  } catch (e) {
    // it shouldn't appened
  }
})

ipcMain.on('print', (event, arg) => {
  console.log(arg);
})

let mainWindow, workerWindow

const createWindow = () => {  
  mainWindow = new BrowserWindow({
    minWidth : 695,
    minHeight : 300,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule : true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'client/index.html'));

  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule:true
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