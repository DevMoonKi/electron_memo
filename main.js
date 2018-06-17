const electron = require('electron')
const fs = require('fs');

// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const mainWindow = {
  list : {}
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let posX
let posY

function createWindow(posX, posY, color) {
  
  // Create the browser window.
  const win = new BrowserWindow(

    {
      width: 300,
      height: 300,
      frame: false,
      x: posX,
      y: posY,
      backgroundColor: color

    }    
    
  )

  const winKey = uniqueKey();
  mainWindow.list[ winKey ] = win;

  console.log(mainWindow);


  win.on('ready-to-show', () => {
    mainWindow.show()
  })


  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow.list[winKey] = null
    delete mainWindow.list[winKey];
  })

   // win.webContents.openDevTools()
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('winKey', winKey)
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  ipcMain.on("new-btn", (event, obj) => {
    console.log(obj.msg);
    event.sender.send("new-btn-reply", { msg: obj.msg + "-reply" });
  });
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('new-window', (e, arg) => {
  createWindow(arg.x, arg.y, arg.color)
})


ipcMain.on('always-on-top', (e, arg) => {

  if( mainWindow.isAlwaysOnTop() == false ){

    mainWindow.setAlwaysOnTop(true)

  }else{

    mainWindow.setAlwaysOnTop(false)

  }

})

ipcMain.on('save', (e, arg) => {
  //remote.getcruuntwindow.getposition
  //console.log(arg)
  fs.writeFileSync( path.join(app.getPath('userData'),'output.txt') ,arg)
  console.log(app.getPath('userData'))
})

// From: https://stackoverflow.com/a/38872723
//랜덤키
function revisedRandId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

//랜덤 키 중복검사
function uniqueKey() {
  const randomKey = revisedRandId()
  if (mainWindow.list[randomKey]) {
    return uniqueKey()
  }
  else {
    return randomKey
  }
}

