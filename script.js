// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {

    // --- Simulação de dados carregados após o login ---
    // No futuro, esses dados virão da sua função serverless de login
    const dadosMotorista = {
        nome: "João da Silva",
        placa: "ABC-1234",
        idVeiculo: "recV9GkSeBf7TcDCK
", // ID do registro do veículo no Airtable (ex: 'recxxxxxxxxxxxxxx')
        logoEmpresa: "https://via.placeholder.com/150x50.png?text=Logo+Empresa", // URL do logo da empresa
        nomeEmpresa: "Construtora Solidez",
        // Adicione aqui o ID da Empresa (ex: 'recYYYYYYYYYYYYYY' ) se precisar para a função serverless
        // idEmpresa: "recYYYYYYYYYYYYYY"
    };

    // Preenche as informações na tela
    document.getElementById('logo-empresa').src = dadosMotorista.logoEmpresa;
    document.getElementById('nome-empresa').textContent = dadosMotorista.nomeEmpresa;
    document.getElementById('nome-motorista').textContent = dadosMotorista.nome;
    document.getElementById('placa-veiculo').textContent = dadosMotorista.placa;

    // --- Elementos de UI ---
    const formAbastecimento = document.getElementById('form-abastecimento');
    const btnAbastecimento = formAbastecimento.querySelector('button[type="submit"]');
    const formFechamento = document.getElementById('form-fechamento');
    const btnFechamento = formFechamento.querySelector('button[type="submit"]');
    const mensagemStatus = document.getElementById('mensagem-status');

    // --- Lógica do Formulário de Abastecimento ---
    formAbastecimento.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Desabilita o botão e mostra mensagem
        btnAbastecimento.disabled = true;
        mostrarMensagem('Enviando dados de abastecimento...', 'info');

        const dados = {
            idVeiculo: dadosMotorista.idVeiculo,
            km: parseFloat(document.getElementById('km-abastecimento').value),
            litros: parseFloat(document.getElementById('litros').value),
            valor: parseFloat(document.getElementById('valor-pago').value)
        };

        try {
            // AQUI VAI A CHAMADA PARA A FUNÇÃO SERVERLESS DE ABASTECIMENTO
            // Substitua '/api/registrar-abastecimento' pela URL da sua função no Vercel
            const response = await fetch('/api/registrar-abastecimento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (response.ok) {
                mostrarMensagem('Abastecimento registrado com sucesso!', 'sucesso');
                formAbastecimento.reset(); // Limpa o formulário
            } else {
                const errorData = await response.json();
                mostrarMensagem(`Erro ao registrar abastecimento: ${errorData.message || response.statusText}`, 'erro');
            }
        } catch (error) {
            console.error('Erro na requisição de abastecimento:', error);
            mostrarMensagem('Erro de conexão ao registrar abastecimento.', 'erro');
        } finally {
            btnAbastecimento.disabled = false; // Reabilita o botão
        }
    });

    // --- Lógica do Formulário de Fechamento Mensal ---
    formFechamento.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Desabilita o botão e mostra mensagem
        btnFechamento.disabled = true;
        mostrarMensagem('Enviando fechamento do mês...', 'info');

        const kmFechamento = parseFloat(document.getElementById('km-fechamento').value);
        const observacoes = document.getElementById('observacoes').value;
        const fotoOdometro = document.getElementById('foto-odometro').files[0]; // Pega o arquivo

        // Validação básica da foto
        if (!fotoOdometro) {
            mostrarMensagem('Por favor, selecione uma foto do odômetro.', 'erro');
            btnFechamento.disabled = false;
            return;
        }

        // FormData é necessário para enviar arquivos
        const formData = new FormData();
        formData.append('idVeiculo', dadosMotorista.idVeiculo);
        formData.append('km', kmFechamento);
        formData.append('observacoes', observacoes);
        formData.append('foto', fotoOdometro); // Anexa o arquivo

        try {
            // AQUI VAI A CHAMADA PARA A FUNÇÃO SERVERLESS DE FECHAMENTO
            // Substitua '/api/registrar-fechamento' pela URL da sua função no Vercel
            const response = await fetch('/api/registrar-fechamento', {
                method: 'POST',
                // Não defina 'Content-Type' para FormData, o navegador faz isso automaticamente
                body: formData,
            });

            if (response.ok) {
                mostrarMensagem('Fechamento do mês registrado com sucesso!', 'sucesso');
                formFechamento.reset(); // Limpa o formulário
            } else {
                const errorData = await response.json();
                mostrarMensagem(`Erro ao registrar fechamento: ${errorData.message || response.statusText}`, 'erro');
            }
        } catch (error) {
            console.error('Erro na requisição de fechamento:', error);
            mostrarMensagem('Erro de conexão ao registrar fechamento.', 'erro');
        } finally {
            btnFechamento.disabled = false; // Reabilita o botão
        }
    });

    // --- Função para mostrar mensagens de status ---
    function mostrarMensagem(texto, tipo) {
        mensagemStatus.textContent = texto;
        mensagemStatus.className = `mensagem-status ${tipo}`; // Adiciona a classe para estilo

        // Esconde a mensagem após 3 segundos
        setTimeout(() => {
            mensagemStatus.className = 'mensagem-status'; // Remove as classes de tipo
            mensagemStatus.textContent = '';
        }, 3000);
    }
});
