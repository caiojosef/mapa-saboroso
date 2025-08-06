<?php
class Database
{
    private $host = 'localhost';
    private $port = '3306';  // Certifique-se de que está usando a porta correta
    private $dbname = 'mapa_saboroso';  // Nome do banco de dados
    private $username = 'root';  // Usuário do banco de dados
    private $password = '';  // Senha do banco (em branco para XAMPP ou USBWebserver)

    // Método para conectar ao banco de dados
    public function conectar()
    {
        try {
            $pdo = new PDO(
                "mysql:host={$this->host};port={$this->port};dbname={$this->dbname};charset=utf8mb4",  // Codificação utf8mb4
                $this->username,
                $this->password
            );
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  // Habilita o modo de erro
            return $pdo;
        } catch (PDOException $e) {
            die("Erro ao conectar ao banco de dados: " . $e->getMessage());
        }
    }
}
