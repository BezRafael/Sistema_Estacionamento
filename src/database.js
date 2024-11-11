const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/data/estacionamento.db', (err) => {
    if(err){
        console.error('Erro ao conectar ao Banco de dados');
    }else{
        console.log('Database Conectado com Sucesso!');    
    }
});


db.serialize(() =>{
    db.run(
        `CREATE TABLE IF NOT EXISTS usuarios(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT,
            senha TEXT
        )`);

    db.run( 
        `CREATE TABLE IF NOT EXISTS veiculos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            modelo TEXT,
            placa TEXT UNIQUE,
            horario_entrada DATATIME,
            horario_saida DATATIME
        )`);
});

module.exports = db;


/*
///Importando o Sqlite3
const sqlite3 = require('sqlite3').verbose()

const { Module } = require('module');
const path = require('path');

//Caminho para o banco de dados SQLite
const dbPath = path.resolve(__dirname, 'data', 'estacionamento.db');


//Conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    }else{
        console.log('Database SQLite... Conectado com Sucesso!! ');
    }
});

// Exemplo de criação de uma tabela
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuario(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL,
            senha TEXT NOT NULL
        );   
    `)
});

module.exports = db;
*/