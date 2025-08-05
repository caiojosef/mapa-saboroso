<?php
// Conectar ao banco de dados
include('config.php');  // Conexão com o banco de dados

header('Content-Type: application/json');

// Captura os dados enviados via POST (JSON)
$data = json_decode(file_get_contents('php://input'), true);

// Verifica se os dados foram recebidos
if (isset($data['nome']) && isset($data['email']) && isset($data['google_id'])) {
    $nome = $data['nome'];
    $email = $data['email'];
    $google_id = $data['google_id'];

    // Verificar se o usuário já existe no banco de dados
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE google_id = ?");
    $stmt->execute([$google_id]);
    $usuario = $stmt->fetch();

    if ($usuario) {
        // Usuário já existe, então apenas retorna sucesso
        echo json_encode(['status' => 'ok', 'mensagem' => 'Usuário já existe']);
    } else {
        // Inserir os dados do novo usuário
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, google_id) VALUES (?, ?, ?)");
        $stmt->execute([$nome, $email, $google_id]);

        if ($stmt) {
            echo json_encode(['status' => 'ok', 'mensagem' => 'Usuário cadastrado com sucesso']);
        } else {
            echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao cadastrar o usuário']);
        }
    }
} else {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados incompletos']);
}
