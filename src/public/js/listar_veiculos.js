const { ipcRenderer } = require('electron');

async function listarVeiculos() {
    // Solicita ao backend a lista de veículos
    const veiculos = await ipcRenderer.invoke('listar-veiculos');

    // Obtém o elemento <tbody> onde os veículos serão exibidos
    const garagem = document.getElementById('garagem');
    
    // Limpa a tabela antes de preencher com os novos dados
    garagem.innerHTML = '';

    // Insere cada veículo como uma nova linha na tabela
    veiculos.forEach(veiculo => {
        const linha = document.createElement('tr');

        const colunaModelo = document.createElement('td');
        colunaModelo.textContent = veiculo.modelo;

        const colunaPlaca = document.createElement('td');
        colunaPlaca.textContent = veiculo.placa;

        const colunaHorario = document.createElement('td');
        colunaHorario.textContent = new Date(veiculo.horario_entrada).toLocaleString();

        linha.appendChild(colunaModelo);
        linha.appendChild(colunaPlaca);
        linha.appendChild(colunaHorario);

        garagem.appendChild(linha);
    });
}


const { ipcRenderer } = require('electron');

async function remover_veiculo() {
    const placa = document.getElementById('input_removerPlaca').value;

    if (!placa) {
        alert('Por favor, insira uma placa.');
        return;
    }

    const resultado = await ipcRenderer.invoke('remover-veiculo', placa);

    if (resultado.success) {
        // Atualiza o número de vagas disponíveis na interface
        document.getElementById('vagas_disponiveis').textContent = `Vagas Disponíveis: ${resultado.vagasDisponiveis}`;

        // Remove o veículo da lista de exibição
        document.getElementById('garagem').innerHTML = ''; // Limpa a tabela atual
        carregarVeiculos(); // Função que recarrega a lista de veículos, se existir

        // Exibe o extrato com horário de saída e valor a pagar
        const extratoDiv = document.getElementById('extrato');
        extratoDiv.innerHTML = `
            <p><strong>Horário de Saída:</strong> ${resultado.horarioSaida}</p>
            <p><strong>Valor a Pagar:</strong> R$ ${resultado.valorAPagar}</p>
        `;
        document.getElementById('status').textContent = 'Veículo removido com sucesso.';
        document.getElementById('status').style.color = 'lightgreen';
    } else {
        document.getElementById('status').textContent = resultado.message;
        document.getElementById('status').style.color = 'lightcoral';
    }
}


// Executa a função de listagem ao carregar a página
window.onload = listarVeiculos;



function voltar() {
    window.location.href = "../views/cadastro_veiculo.html";
}

// Função para fechar o aplicativo
function fecharApp() {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('fechar-app');
};