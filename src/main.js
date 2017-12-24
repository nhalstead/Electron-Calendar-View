const {app, Menu, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
var fs = require('fs');
var events = require('events');


var config = JSON.parse(fs.readFileSync("src/config.json"));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
	let win;

// Disable all of the Default Menu and Define a new One
	app.on('browser-window-created',function(e, window) {
	  window.setMenu( Menu.buildFromTemplate([
      {
        label: 'File',
        submenu: [
          {
            label: 'Reload',
            click() {
                win.webContents.reload();
            }
          },
          {
            label: 'Clear Login',
            click() {
                win.webContents.session.clearStorageData();
                win.webContents.reload();
            }
          },
          {
            label: 'Close',
            click() {
                app.quit();
            }
          },
          {
            label: 'Inspect',
            click(){
              win.webContents.openDevTools();
            }
          }
        ]
      },
      {
        label: 'Home',
        click() {
            win.loadURL(config.google_url);
        }
      }

    ]));
	});

// Listen for Events Fromt the Render Process
  ipcMain.on('setup', (event, arg) => {
    console.log('Sending URL in IPC')
    event.sender.send('define_url', {'url': config.google_url } )
  })

// Create the browser window and all of the Other Fun stuff. (On Call!)
function createWindow () {
  win = new BrowserWindow({
		width: 1400, height: 1000,
		backgroundColor: '#2e2c29',
		resizable: true,
		movable: true,
		minimizable: true,
		closable: true,
		alwaysOnTop: false,
    webPreferences: { zoomFactor: 0.9 }
	});

  // Load the file of the app.
  win.loadURL(config.google_url);
  /*win.loadURL(url.format({
    pathname: path.join(__dirname, 'static/index.html'),
    protocol: 'file:',
    slashes: true
  }));*/

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

// This method will be called when Electron has finished Setup.
app.on('ready', function(){
	createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
