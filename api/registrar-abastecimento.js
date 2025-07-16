// api/registrar-abastecimento.js

const Airtable = require('airtable');

// Inicializa o Airtable com sua API Key e Base ID
// A API Key é acessada via variável de ambiente por segurança
// O Base ID é o ID da sua base 'KM Fácil' no Airtable
const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

// Nome da tabela no Airtable onde os abastecimentos serão registrados
const TABLE_NAME = 'Registros de Abastecimento';

module.exports = async (req, res) => {
    // A função serverless só aceita requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido. Use POST.' });
    }

    try {
        const { idVeiculo, km, litros, valor } = req.body;

        // Validação básica dos dados
        if (!idVeiculo || isNaN(km) || isNaN(litros) || isNaN(valor)) {
            return res.status(400).json({ message: 'Dados incompletos ou inválidos.' });
        }

        // Cria um novo registro na tabela 'Registros de Abastecimento'
        await base(TABLE_NAME).create({
            "Veículo": [idveiculo], // Link para o registro do veículo
            "Data": new Date().toISOString(), // Data e hora atual
            "KM do Abastecimento": km,
            "Litros": litros,
            "Valor Pago": valor
        });

        res.status(200).json({ message: 'Abastecimento registrado com sucesso!' });

    } catch (error) {
        console.error('Erro ao registrar abastecimento no Airtable:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao registrar abastecimento.', error: error.message });
    }
};
