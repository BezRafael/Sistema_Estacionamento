var totalVagas = 20;

// Função disparada após o clique do botão cadastrar
function cadastrar_veiculo() {
    const modelo_veiculo = document.getElementById('modelo_veiculo').value;
    const placa_veiculo = document.getElementById('placa_veiculo').value;
    const horario_entrada = new Date().toLocaleTimeString('pt-BR');
    const horario_entrada_ms = new Date().getTime();

    // Verificar vagas disponíveis antes de cadastrar
    const garagem = localStorage.garagem ? JSON.parse(localStorage.garagem) : [];
    const vagas_disponiveis = totalVagas - garagem.length;

    if (vagas_disponiveis <= 0) {
        document.getElementById('status').style.color = 'lightcoral';
        document.getElementById('status').innerHTML = 'Não há vagas disponíveis!';
        return;
    }

    if (!modelo_veiculo || !placa_veiculo) {
        document.getElementById('status').style.color = 'lightcoral';
        document.getElementById('status').innerHTML = 'Preencha Todos os Campos!';
    } else {
        const veiculo = {
            modelo_veiculo: modelo_veiculo,
            placa_veiculo: placa_veiculo,
            horario_entrada: horario_entrada,
            horario_entrada_ms: horario_entrada_ms
        };

        garagem.push(veiculo);
        localStorage.garagem = JSON.stringify(garagem);

        document.getElementById('modelo_veiculo').value = '';
        document.getElementById('placa_veiculo').value = '';

        document.getElementById('status').style.color = 'lightgreen';
        document.getElementById('status').innerHTML = 'Veículo Cadastrado!';

        mostrar_veiculos();
        atualizar_vagas();
    }
}

function atualizar_vagas() {
    const garagem = JSON.parse(localStorage.getItem('garagem')) || [];
    const vagas_disponiveis = totalVagas - garagem.length;
    console.log(`Total de vagas: ${totalVagas}`); // Log para depuração
    console.log(`Veículos na garagem: ${garagem.length}`); // Log para depuração
    console.log(`Vagas disponíveis: ${vagas_disponiveis}`); // Log para depuração

    const vagasElement = document.getElementById('vagas_disponiveis');
    if (vagasElement) {
        vagasElement.innerHTML = `Vagas Disponíveis: ${vagas_disponiveis}`;
    } else {
        console.error('Elemento "vagas_disponiveis" não encontrado.');
    }
}

function mostrar_veiculos() {
    const garagem = JSON.parse(localStorage.getItem('garagem')) || [];
    const tbody = document.querySelector('#tabela-veiculos tbody');
    if (tbody) {
        tbody.innerHTML = '';

        garagem.forEach(veiculo => {
            const tr = document.createElement('tr');
            const tdModelo = document.createElement('td');
            const tdPlaca = document.createElement('td');
            const tdHorario = document.createElement('td');

            tdModelo.textContent = veiculo.modelo_veiculo;
            tdPlaca.textContent = veiculo.placa_veiculo;
            tdHorario.textContent = veiculo.horario_entrada;

            tr.appendChild(tdModelo);
            tr.appendChild(tdPlaca);
            tr.appendChild(tdHorario);
            tbody.appendChild(tr);
        });
    } else {
        console.error('Elemento "tbody" não encontrado.');
    }

    atualizar_vagas();
}

document.addEventListener('DOMContentLoaded', mostrar_veiculos);

function abrir_lista() {
    window.location.href = "../views/lista_veiculos.html";
}

function voltar() {
    window.location.href = "../views/cadastro_veiculo.html";
}

function remover_veiculo() {
    const placa_remover = document.getElementById('input_removerPlaca').value;
    if (!placa_remover) {
        alert("Por favor, digite uma placa para remover.");
        return;
    }

    let garagem = JSON.parse(localStorage.getItem('garagem')) || [];
    const veiculo = garagem.find(veiculo => veiculo.placa_veiculo === placa_remover);
    
    if (!veiculo) {
        document.getElementById('extrato_detalhes').innerHTML = 'Veículo não Encontrado!';
        return;
    }

    // Calculando o horário de saída e valor a pagar
    const horario_saida = new Date().toLocaleTimeString('pt-BR');
    const horario_saida_ms = new Date().getTime();
    const duracao_ms = horario_saida_ms - veiculo.horario_entrada_ms;
    const duracao_horas = Math.ceil(duracao_ms / (1000 * 60 * 60));
    const valor_por_hora = 5;
    const valor_total = duracao_horas * valor_por_hora;

    // Exibindo o modal com os detalhes do extrato
    const modal = document.getElementById('modal_extrato');
    const span = document.getElementById('close_modal');
    const extrato_detalhes = document.getElementById('extrato_detalhes');

    extrato_detalhes.innerHTML = `
        <p>Placa: ${veiculo.placa_veiculo}</p>
        <p>Horário de Entrada: ${veiculo.horario_entrada}</p>
        <p>Horário de Saída: ${horario_saida}</p>
        <p>Tempo de Permanência: ${duracao_horas} hora(s)</p>
        <p>Valor a Pagar: R$ ${valor_total},00</p>
    `;

    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Removendo o veículo do localStorage
    const nova_garagem = garagem.filter(veiculo => veiculo.placa_veiculo !== placa_remover);
    localStorage.setItem('garagem', JSON.stringify(nova_garagem));
    mostrar_veiculos();
    atualizar_vagas();

    document.getElementById('input_removerPlaca').value = '';
}
