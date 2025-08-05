<?php
class Database {
    private $host = 'localhost';
    private $port = '3306'; // ou '3307' para USBWebserver, se necessário
    private $dbname = 'mapa_saboroso';
    private $username = 'root';
    private $password = 'usbw'; // '' para XAMPP, 'root' para USBWebserver às vezes

    public function conectar() {
        try {
            $pdo = new PDO(
                "mysql:host={$this->host};port={$this->port};dbname={$this->dbname};charset=utf8",
                $this->username,
                $this->password
            );
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            die("Erro ao conectar: " . $e->getMessage());
        }
    }
}
