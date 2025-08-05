<?php
header('Content-Type: application/json');
require_once '../config/database.php';

// Lê o corpo da requisição
$input = json_decode(file_get_contents('php://input'), true);

// Verifica se os campos estão presentes
if (
    !isset($input['nome']) ||
    !isset($input['sobrenome']) ||
    !isset($input['email']) ||
    !isset($input['senha'])
) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados incompletos.']);
    exit;
}

$nome = trim($input['nome']);
$sobrenome = trim($input['sobrenome']);
$email = trim($input['email']);
$senha = $input['senha'];

// Validações básicas
// Validações básicas
if (empty($nome) || empty($sobrenome) || empty($email) || empty($senha)) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Preencha todos os campos.']);
    exit;
}

// Validação de senha
$erros = [];

if (strlen($senha) < 8) {
    $erros[] = "Mínimo de 8 caracteres";
}
if (!preg_match('/[0-9]/', $senha)) {
    $erros[] = "Pelo menos 1 número";
}
if (!preg_match('/[a-z]/', $senha) || !preg_match('/[A-Z]/', $senha)) {
    $erros[] = "Pelo menos 1 letra maiúscula e 1 minúscula";
}
if (!preg_match('/[\W_]/', $senha)) {
    $erros[] = "Pelo menos 1 caractere especial (ex: @, #, !)";
}

if (!empty($erros)) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => implode("<br>", $erros)
    ]);
    exit;
}

try {
    $db = new Database();
    $conn = $db->conectar();

    // Verifica se já existe um usuário com esse e-mail
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Este e-mail já está em uso.']);
        exit;
    }

    // Criptografa a senha
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    // Insere o novo usuário
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)");
    $stmt->execute([$nome, $sobrenome, $email, $senhaHash]);

    echo json_encode(['status' => 'ok']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao cadastrar: ' . $e->getMessage()]);
}
