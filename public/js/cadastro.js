document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-cadastro');
    const requisitosEl = document.getElementById('requisitos-senha');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome = form.nome.value.trim();
        const sobrenome = form.sobrenome.value.trim();
        const email = form.email.value.trim();
        const senha = form.senha.value;
        const confirmarSenha = form.confirmar_senha.value;

        if (senha !== confirmarSenha) {
            requisitosEl.innerHTML = '<p class="text-danger">As senhas não conferem.</p>';
            return;
        }

        try {
            const resposta = await fetch('../api/cadastrar-usuario.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, sobrenome, email, senha })
            });

            const resultado = await resposta.json();

            if (resultado.status === 'ok') {
                window.location.href = 'login.html';
            } else {
                requisitosEl.innerHTML = `<div class="text-danger small">${resultado.mensagem}</div>`;
            }
        } catch (erro) {
            requisitosEl.innerHTML = `<p class="text-danger">Erro ao conectar com o servidor.</p>`;
        }
    });
});
