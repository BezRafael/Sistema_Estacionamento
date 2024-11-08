const { app, BrowserWindow, Menu, nativeTheme, shell, ipcMain } = require('electron');

//importe o arquivo database.js
const db = require('./src/database');


//lógica para verificar o login no banco de dados:
ipcMain.handle('verificar-login', async (event, {usuario, senha}) => {
  return new Promises((resovle, reject) => {
    const query = 'SELECT FROM usuario WHERE usuario = ? AND senha = ?';

    db.get(query, [usuario, senha], (err, row) =>{
      if (err) {
        console.error('Erro ao verificar login:', err.message);
        reject({ sucess: false, error: err.message});
      }else if(row){
        resovle({sucess: true});
      }else{
        resovle({sucess: false});
      }
    });
  });
});


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

//Template do Menu Vazio
const template = [

]

// //Template do Menu
// const template = [
//   {
//     label: 'Ajuda',
//     submenu: [
//       {
//         label: 'Docs',
//         click: () => shell.openExternal('https://www.electronjs.org/pt/docs/latest/'),
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: 'Sobre',
//         click: () => aboutWindow()
//       }
//     ]
//   }
// ]

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