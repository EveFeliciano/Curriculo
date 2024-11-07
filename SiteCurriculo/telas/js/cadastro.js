console.log("Arquivo cadastro.js carregado");

const params = new URLSearchParams(window.location.search);
const error = params.get('error');
console.log("Parâmetro error:", error); // Verifica se o parâmetro foi capturado corretamente

// Se o parâmetro 'error' existir, exibe a div com a mensagem de erro
if (error) {
    const errorMessage = decodeURIComponent(error); // Decodifica a mensagem
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = errorMessage; // Atualiza o texto da div com a mensagem de erro
    errorDiv.style.display = 'block'; // Torna a div visível
}