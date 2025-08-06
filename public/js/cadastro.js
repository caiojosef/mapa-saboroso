document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-cadastro');
    const requisitosEl = document.getElementById('requisitos-senha'); // Onde as mensagens de erro serão exibidas
    const erroMensagem = document.getElementById('erro-mensagem');  // A div onde os erros vão aparecer
    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    const barraCarregamento = document.getElementById('barra-carregamento'); // Barra de carregamento

    // Função para formatar a primeira letra de nome e sobrenome
    function formatarNomeSobrenome(input) {
        input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1).toLowerCase();
    }

    // Corrigir ao vivo o nome e sobrenome enquanto o usuário digita
    form.nome.addEventListener('input', function () {
        formatarNomeSobrenome(form.nome);
    });

    form.sobrenome.addEventListener('input', function () {
        formatarNomeSobrenome(form.sobrenome);
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Evita o envio tradicional do formulário

        let nome = form.nome.value.trim();
        let sobrenome = form.sobrenome.value.trim();
        const email = form.email.value.trim();
        const senha = form.senha.value;
        const confirmarSenha = form.confirmar_senha.value;

        // Resetar as mensagens de erro e sucesso
        erroMensagem.innerHTML = '';  // Limpar a div de erro
        erroMensagem.style.display = 'none';  // Esconder a div inicialmente
        mensagemSucesso.style.display = 'none';
        requisitosEl.innerHTML = '';  // Limpa qualquer mensagem anterior de erro

        // Verificar se as senhas coincidem
        if (senha !== confirmarSenha) {
            requisitosEl.innerHTML = '<p>As senhas não conferem.</p>';
            return;
        }

        // Verificar se o e-mail tem o formato correto
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            // Adicionar a mensagem de erro do e-mail à lista de erros
            const ul = document.createElement('ul');  // Cria uma lista
            const li = document.createElement('li');  // Cria um item de lista
            li.classList.add('text-danger');  // Adiciona a classe de erro
            li.textContent = 'Por favor, insira um e-mail válido.';  // Adiciona o erro como conteúdo do item
            ul.appendChild(li);  // Adiciona o item à lista
            requisitosEl.appendChild(ul);  // Exibe a lista com o erro
            return;
        }

        // Exibir a barra de carregamento enquanto o cadastro é processado
        barraCarregamento.style.display = 'block';

        // Enviar os dados para o PHP via AJAX
        try {
            const resposta = await fetch('../api/cadastrar-usuario.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, sobrenome, email, senha })
            });

            const resultado = await resposta.json();

            if (resultado.status === 'ok') {
                // Exibir a mensagem de sucesso
                mensagemSucesso.style.display = 'block';

                // Aguardar 2 segundos antes de redirecionar para o login
                setTimeout(() => {
                    // Esconder a barra de carregamento e redirecionar para a página de login
                    barraCarregamento.style.display = 'none';
                    window.location.href = 'login.html';  // Redireciona para a página de login
                }, 2000);  // Aguarda 2 segundos para exibir a mensagem de sucesso
            } else {
                // Se houver erros, mostrar as mensagens de erro
                requisitosEl.innerHTML = '';  // Limpa a lista de requisitos
                const erros = resultado.mensagem;  // A resposta do PHP vem como um array de erros

                // Criar uma lista de erros formatada
                const ul = document.createElement('ul');  // Cria uma lista
                erros.forEach(erro => {
                    const li = document.createElement('li');  // Cria um item de lista para cada erro
                    li.classList.add('text-danger');  // Adiciona a classe de erro
                    li.textContent = erro;  // Adiciona o erro como conteúdo do item
                    ul.appendChild(li);  // Adiciona o item à lista
                });

                // Substitui o conteúdo da div com a lista de erros
                requisitosEl.appendChild(ul);
            }
        } catch (erro) {
            // Exibe erro de conexão
            erroMensagem.innerHTML = '<p>Erro ao conectar com o servidor.</p>';
            erroMensagem.style.display = 'block';
        } finally {
            barraCarregamento.style.display = 'none';  // Esconde a barra de carregamento
        }
    });
});
