<?php
require_once '../config/database.php';

$db = new Database();
$conexao = $db->conectar();

if ($conexao) {
    echo "✅ Conexão com o banco de dados estabelecida com sucesso!";
} else {
    echo "❌ Falha na conexão com o banco de dados.";
}
