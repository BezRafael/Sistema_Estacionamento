const { app, BrowserWindow, Menu, nativeTheme,shell, ipcMain } = require('electron');

//Janela Principal
const createWindow = () => {
    nativeTheme.themeSource = 'dark'
    const win = new BrowserWindow({
      width: 1000,
      height: 600,
      icon: "./src/public/img/img_logo.png", //Ícone do Executável
      fullscreen: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    //Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/login_usuario.html');
};

  

//Janela Sobre
const aboutWindow = () => {
  const janelaPrincipal = BrowserWindow.getFocusedWindow()
  if (janelaPrincipal) {
    const about = new BrowserWindow({
      width: 380,
      height: 300,
      icon: "./src/public/img/img_logo.png",
      autoHideMenuBar: true, //Esconder o menu
      resizable: false, //redimensionamento
      parent: janelaPrincipal,
      modal: true
    })
    about.loadFile('./src/views/sobre.html')
  }
};

ipcMain.on('fechar-app', () => {
  const windows = BrowserWindow.getAllWindows();
  windows.forEach(window => window.close());
  app.quit();
});

//Template do Menu
const template = [
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Docs',
        click: () => shell.openExternal('https://www.electronjs.org/pt/docs/latest/'),
      },
      {
        type: 'separator'
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

console.log("Iniciando Processos... Iniciado com Sucesso!!")