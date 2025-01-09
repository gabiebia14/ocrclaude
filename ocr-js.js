let currentFile = null;

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        currentFile = file;
        
        // Mostrar preview da imagem
        const preview = document.getElementById('imagePreview');
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        
        reader.readAsDataURL(file);
        
        // Mostrar botão de extração
        document.getElementById('extractButton').style.display = 'block';
    }
});

async function extractText() {
    if (!currentFile) {
        alert('Por favor, selecione um documento primeiro.');
        return;
    }

    document.getElementById('loading').classList.add('active');
    try {
        const result = await Tesseract.recognize(currentFile, 'por', {
            logger: m => console.log(m)
        });
        document.getElementById('extractedText').value = result.data.text;
        
        // Tentativa de extrair informações específicas
        const text = result.data.text.toLowerCase();
        const lines = text.split('\n');
        
        // Procurar por padrões comuns nos documentos
        lines.forEach(line => {
            if (line.includes('nome')) {
                document.getElementById('nome').value = line.split(':')[1]?.trim() || '';
            }
            if (line.includes('rg')) {
                document.getElementById('rg').value = line.split(':')[1]?.trim() || '';
            }
            if (line.includes('cpf')) {
                document.getElementById('cpf').value = line.split(':')[1]?.trim() || '';
            }
            // ... adicione mais padrões conforme necessário
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao processar o documento. Por favor, tente novamente.');
    } finally {
        document.getElementById('loading').classList.remove('active');
    }
}

function copyExtractedText() {
    const textarea = document.getElementById('extractedText');
    textarea.select();
    document.execCommand('copy');
    alert('Texto copiado!');
}

function exportData() {
    const formData = {
        nome: document.getElementById('nome').value,
        nacionalidade: document.getElementById('nacionalidade').value,
        estadoCivil: document.getElementById('estadoCivil').value,
        profissao: document.getElementById('profissao').value,
        rg: document.getElementById('rg').value,
        cpf: document.getElementById('cpf').value,
        endereco: document.getElementById('endereco').value,
        bairro: document.getElementById('bairro').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        telefone: document.getElementById('telefone').value
    };

    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'dados_extraidos.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
