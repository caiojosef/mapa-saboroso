document.addEventListener('DOMContentLoaded', function () {
    // Inicializa a API do Google
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: '966210055343-v6u9vrjovbkskcctn0839pbjglf6jsul.apps.googleusercontent.com' // Insira seu ID de cliente do Google aqui
        });

        // Obter o botão de login
        const googleLoginBtn = document.getElementById('btnGoogle');

        // Adicionar evento de login ao botão
        googleLoginBtn.addEventListener('click', function () {
            const auth2 = gapi.auth2.getAuthInstance();

            // Iniciar o login com Google
            auth2.signIn({
                redirect_uri: 'http://localhost/auth/google/callback'  // Redirecionamento explícito
            }).then(function (googleUser) {
                // Pegar os dados do usuário autenticado
                const profile = googleUser.getBasicProfile();
                const email = profile.getEmail();
                const nome = profile.getName();
                const google_id = googleUser.getId(); // Pega o ID do Google

                // Exibir os dados ou enviar para o backend
                console.log('Nome: ' + nome);
                console.log('E-mail: ' + email);
                console.log('Google ID: ' + google_id);

                // Enviar os dados para o backend via AJAX (fetch)
                enviarDadosParaBackend(nome, email, google_id);
            });
        });
    });
});

// Função para enviar os dados para o backend (PHP)
function enviarDadosParaBackend(nome, email, google_id) {
    const dados = {
        nome: nome,
        email: email,
        google_id: google_id
    };

    // Enviar os dados via AJAX para o PHP
    fetch('../api/cadastrar-usuario-google.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados) // Envia os dados para o PHP
    })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Exibe a resposta do servidor
            if (data.status === 'ok') {
                // Redireciona para a página principal ou página de boas-vindas
                window.location.href = 'home.html';
            } else {
                alert('Erro ao cadastrar usuário!');
            }
        })
        .catch(error => console.error('Erro:', error));
}