
const { ipcRenderer } = require('electron');

document.getElementById('botao_login').addEventListener('click', async () => {
    console.log("Botão de login clicado"); // Teste de saída
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    // Envia a solicitação de login para o processo principal
    const resultado = await ipcRenderer.invoke('verificar-login', { usuario, senha });
    
    if (resultado.success) {
        window.location.href = '../views/cadastro_veiculo.html';
    } else {
        document.getElementById('status').textContent = 'Erro ao Acessar!';
        document.getElementById('status').style.color = 'lightcoral';
    }
});
















/*
const usuarioPadrao = 'Admin'
const senhaPadrao = 'Admin'

document.getElementById('botao_login').addEventListener('click', botaoEntrar);
*/


/*
function botaoEntrar(){
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;


    if(!usuario || !senha){
        document.getElementById('status').style.color = 'lightcoral';
        document.getElementById('status').innerHTML = 'Preencha os Campos!';
    }else{
        if(usuario !== usuarioPadrao || senha !== senhaPadrao){
            document.getElementById('status').style.color = 'lightcoral';
            document.getElementById('status').innerHTML = 'Dados Incorretos!';
        }else{
            window.location.href = '../views/cadastro_veiculo.html';
        }
    }
};
*/
