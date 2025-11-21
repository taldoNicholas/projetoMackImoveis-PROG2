const Validations = {
    usuario: {
        nome: (nome) => {
            if (!nome || nome.trim() === '') {
                return { valido: false, mensagem: 'Nome é obrigatório' };
            }
            if (nome.trim().length < 2) {
                return { valido: false, mensagem: 'Nome deve ter no mínimo 2 caracteres' };
            }
            if (nome.length > 100) {
                return { valido: false, mensagem: 'Nome deve ter no máximo 100 caracteres' };
            }
            return { valido: true };
        },
        
        email: (email) => {
            if (!email || email.trim() === '') {
                return { valido: false, mensagem: 'Email é obrigatório' };
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { valido: false, mensagem: 'Email deve ser válido' };
            }
            return { valido: true };
        },
        
        senha: (senha) => {
            if (!senha || senha.trim() === '') {
                return { valido: false, mensagem: 'Senha é obrigatória' };
            }
            if (senha.length < 6) {
                return { valido: false, mensagem: 'Senha deve ter no mínimo 6 caracteres' };
            }
            return { valido: true };
        }
    },
    
    propriedade: {
        titulo: (titulo) => {
            if (!titulo || titulo.trim() === '') {
                return { valido: false, mensagem: 'Título é obrigatório' };
            }
            if (titulo.trim().length < 3) {
                return { valido: false, mensagem: 'Título deve ter no mínimo 3 caracteres' };
            }
            if (titulo.length > 200) {
                return { valido: false, mensagem: 'Título deve ter no máximo 200 caracteres' };
            }
            return { valido: true };
        },
        
        descricao: (descricao) => {
            if (!descricao || descricao.trim() === '') {
                return { valido: false, mensagem: 'Descrição é obrigatória' };
            }
            if (descricao.trim().length < 10) {
                return { valido: false, mensagem: 'Descrição deve ter no mínimo 10 caracteres' };
            }
            if (descricao.length > 2000) {
                return { valido: false, mensagem: 'Descrição deve ter no máximo 2000 caracteres' };
            }
            return { valido: true };
        },
        
        localizacao: (localizacao) => {
            if (!localizacao || localizacao.trim() === '') {
                return { valido: false, mensagem: 'Localização é obrigatória' };
            }
            if (localizacao.length > 200) {
                return { valido: false, mensagem: 'Localização deve ter no máximo 200 caracteres' };
            }
            return { valido: true };
        },
        
        capacidade: (capacidade) => {
            if (capacidade === null || capacidade === undefined || capacidade === '') {
                return { valido: false, mensagem: 'Capacidade é obrigatória' };
            }
            const cap = parseInt(capacidade);
            if (isNaN(cap)) {
                return { valido: false, mensagem: 'Capacidade deve ser um número' };
            }
            if (cap < 1) {
                return { valido: false, mensagem: 'Capacidade deve ser no mínimo 1' };
            }
            return { valido: true };
        },
        
        precoPorNoite: (preco) => {
            if (preco === null || preco === undefined || preco === '') {
                return { valido: false, mensagem: 'Preço por noite é obrigatório' };
            }
            const precoLimpo = preco.toString().replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
            const precoNum = parseFloat(precoLimpo);
            if (isNaN(precoNum)) {
                return { valido: false, mensagem: 'Preço por noite deve ser um número' };
            }
            if (precoNum <= 0) {
                return { valido: false, mensagem: 'Preço por noite deve ser positivo' };
            }
            return { valido: true };
        }
    },
    
    reserva: {
        dataCheckin: (dataCheckin) => {
            if (!dataCheckin) {
                return { valido: false, mensagem: 'Data de check-in é obrigatória' };
            }
            const data = new Date(dataCheckin);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            data.setHours(0, 0, 0, 0);
            
            if (data < hoje) {
                return { valido: false, mensagem: 'Data de check-in não pode ser no passado' };
            }
            return { valido: true };
        },
        
        dataCheckout: (dataCheckout, dataCheckin) => {
            if (!dataCheckout) {
                return { valido: false, mensagem: 'Data de check-out é obrigatória' };
            }
            
            if (dataCheckin) {
                const checkin = new Date(dataCheckin);
                const checkout = new Date(dataCheckout);
                checkin.setHours(0, 0, 0, 0);
                checkout.setHours(0, 0, 0, 0);
                
                if (checkout <= checkin) {
                    return { valido: false, mensagem: 'Data de check-out deve ser posterior à data de check-in' };
                }
            }
            
            return { valido: true };
        },
        
        validarDatas: (dataCheckin, dataCheckout) => {
            if (!dataCheckin) {
                return { valido: false, mensagem: 'Data de check-in é obrigatória' };
            }
            
            const validacaoCheckin = Validations.reserva.dataCheckin(dataCheckin);
            if (!validacaoCheckin.valido) {
                return validacaoCheckin;
            }
            
            if (!dataCheckout) {
                return { valido: false, mensagem: 'Data de check-out é obrigatória' };
            }
            
            const validacaoCheckout = Validations.reserva.dataCheckout(dataCheckout, dataCheckin);
            if (!validacaoCheckout.valido) {
                return validacaoCheckout;
            }
            
            return { valido: true };
        }
    },
    
    mostrarErro: (campoId, mensagem) => {
        const campo = $(`#${campoId}`);
        campo.addClass('erro-campo');
        campo.siblings('.mensagem-erro').remove();
        const mensagemErro = $('<span>').addClass('mensagem-erro').text(mensagem);
        campo.after(mensagemErro);
    },
    
    removerErro: (campoId) => {
        const campo = $(`#${campoId}`);
        campo.removeClass('erro-campo');
        campo.siblings('.mensagem-erro').remove();
    },
    
    validarFormulario: (validacoes) => {
        let valido = true;
        
        for (const [campoId, validacao] of Object.entries(validacoes)) {
            if (!validacao.valido) {
                Validations.mostrarErro(campoId, validacao.mensagem);
                valido = false;
            } else {
                Validations.removerErro(campoId);
            }
        }
        
        return valido;
    }
};

