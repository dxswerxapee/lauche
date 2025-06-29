const { contextBridge, ipcRenderer } = require('electron');

// Безопасный API для взаимодействия с главным процессом
contextBridge.exposeInMainWorld('electronAPI', {
  // Информация о приложении
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  // Управление окном
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Системная информация
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Уведомления
  showNotification: (title, body) => {
    new Notification(title, { body });
  }
});

// Предотвращаем доступ к Node.js API из рендерера
delete window.require;
delete window.exports;
delete window.module; 