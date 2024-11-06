const ipcRenderer = require('electron');
/*
const usuarioPadrao = 'Admin'
const senhaPadrao = 'Admin'
*/


export default function botaoEntrar(){

    //buscando os valores que o usuário inseriu no frontend
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    //Enviando uma mensagem para o processo principal (definido no main.js)
    ipcRenderer.invoke('verificar-login', {usuario, senha})
        .then(response => {
            const elementoStatus = document.getElementById('status');
            if (response.sucess) {
                elementoStatus.textContent = 'Bem Vindo!'
                elementoStatus.style.color = 'lightgreen';
                window.location.href = 'src\views\cadastro_veiculo.html';
            }else{
                elementoStatus.textContent = 'Dados Incorretos!'
                elementoStatus.style.color = 'lightcoral';
            }
        })

        .catch(error => {
            console.error('Erro ao verificar Login:', error);
        });
}


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