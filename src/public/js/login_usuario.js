const usuarioPadrao = 'Admin'
const senhaPadrao = 'Admin'


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