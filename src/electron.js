const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  // Создаем главное окно приложения
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false, // Убираем стандартную рамку для кастомного дизайна
    transparent: true, // Прозрачность для эффектов
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false, // Не показываем до загрузки
    webSecurity: false
  });

  // Загружаем приложение
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Показываем окно после загрузки
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Фокусируемся на окне
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Обработка закрытия окна
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Обработка внешних ссылок
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Убираем меню
  Menu.setApplicationMenu(null);
}

// События приложения
app.whenReady().then(createWindow);

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

// IPC обработчики для взаимодействия с рендерером
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('get-system-info', () => {
  const os = require('os');
  return {
    platform: process.platform,
    arch: process.arch,
    version: os.release(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpus: os.cpus().length
  };
}); 