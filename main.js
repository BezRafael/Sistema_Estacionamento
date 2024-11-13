const { app, BrowserWindow, Menu, nativeTheme, shell, ipcMain } = require('electron');

//importe o arquivo database.js
const db = require('./src/database');


/**/
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS config(
      id INTEGER PRIMARY KEY,
      vagasDisponiveis INTEGER
    )`)


    db.get(`SELECT * FROM config WHERE id = 1`, (err, row) => {
      if (!row) {
         // Inicializa o banco com 10 vagas
         db.run('INSERT INTO config (id, vagasDisponiveis) VALUES (?, ?)', [1, 10]);
      }
    })
})


/**/
ipcMain.handle('verificar-login', async (event, { usuario, senha }) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';

        db.get(query, [usuario, senha], (err, row) => {
            if (err) {
                console.error('Erro ao verificar login:', err.message);
                resolve({ success: false, error: err.message });
            } else if (row) {
                resolve({ success: true });
            } else {
                resolve({ success: false });
            }
        });
    });
});

/**/
// Limite de vagas
ipcMain.handle('cadastrar-veiculo', async (event, { modelo, placa }) => {
  return new Promise((resolve, reject) => {
      db.get('SELECT * FROM config WHERE id = 1', (err, row) => {
          if (err || !row) {
              resolve({ success: false, message: 'Erro ao acessar o número de vagas.' });
              return;
          }

          let vagasDisponiveis = row.vagasDisponiveis;

          if (vagasDisponiveis <= 0) {
              resolve({ success: false, message: 'Não há vagas disponíveis.' });
              return;
          }

          const horarioEntrada = new Date().toISOString();

          const query = 'INSERT INTO veiculos (modelo, placa, horario_entrada) VALUES (?, ?, ?)';
          db.run(query, [modelo, placa, horarioEntrada], (err) => {
              if (err) {
                  console.error('Erro ao cadastrar veículo:', err.message);
                  resolve({ success: false, message: 'Erro ao cadastrar veículo.' });
              } else {
                  // Atualiza o número de vagas no banco
                  db.run('UPDATE config SET vagasDisponiveis = ? WHERE id = 1', [vagasDisponiveis - 1], (err) => {
                      if (err) {
                          console.error('Erro ao atualizar vagas:', err.message);
                          resolve({ success: false, message: 'Erro ao atualizar vagas.' });
                      } else {
                          resolve({ success: true, vagasDisponiveis: vagasDisponiveis - 1 });
                      }
                  });
              }
          });
      });
  });
});

ipcMain.handle('obter-vagas', async () => {
  return new Promise((resolve, reject) => {
      db.get('SELECT * FROM config WHERE id = 1', (err, row) => {
          if (err || !row) {
              resolve(10);  // Valor padrão de 10 vagas
          } else {
              resolve(row.vagasDisponiveis);
          }
      });
  });
});



// Função para buscar todos os veículos
ipcMain.handle('listar-veiculos', async () => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT modelo, placa, horario_entrada FROM veiculos';
      db.all(query, (err, rows) => {
          if (err) {
              console.error('Erro ao buscar veículos:', err.message);
              resolve([]); // Retorna um array vazio em caso de erro
          } else {
              resolve(rows); // Retorna todos os veículos encontrados
          }
      });
  });
});

/**/
ipcMain.handle('remover-veiculo', async (event, placa) => {
    return new Promise((resolve, reject) => {
        // Busca o veículo no banco de dados pela placa
        db.get('SELECT * FROM veiculos WHERE placa = ?', [placa], (err, veiculo) => {
            if (err || !veiculo) {
                resolve({ success: false, message: 'Veículo não encontrado.' });
                return;
            }

            // Calcula o horário de saída e o valor a pagar com base no horário de entrada
            const horarioSaida = new Date();
            const horarioEntrada = new Date(veiculo.horario_entrada);
            const tempoPermanencia = (horarioSaida - horarioEntrada) / (1000 * 60); // Tempo em minutos
            const valorPorMinuto = 0.5; // Valor por minuto
            const valorAPagar = (tempoPermanencia * valorPorMinuto).toFixed(2);

            // Remove o veículo do banco de dados
            db.run('DELETE FROM veiculos WHERE placa = ?', [placa], (err) => {
                if (err) {
                    resolve({ success: false, message: 'Erro ao remover o veículo.' });
                } else {
                    // Atualiza o número de vagas disponíveis
                    db.get('SELECT vagasDisponiveis FROM config WHERE id = 1', (err, row) => {
                        if (row) {
                            const vagasAtualizadas = row.vagasDisponiveis + 1;
                            db.run('UPDATE config SET vagasDisponiveis = ? WHERE id = 1', [vagasAtualizadas], (err) => {
                                if (err) {
                                    resolve({ success: false, message: 'Erro ao atualizar vagas.' });
                                } else {
                                    resolve({
                                        success: true,
                                        horarioSaida: horarioSaida.toLocaleTimeString(),
                                        valorAPagar: valorAPagar,
                                        vagasDisponiveis: vagasAtualizadas,
                                    });
                                }
                            });
                        } else {
                            resolve({ success: false, message: 'Erro ao acessar vagas.' });
                        }
                    });
                }
            });
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
        contextIsolation: false,
        enableRemoteModule: true
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