$(document).ready(() => {
    const usuario = Auth.getUsuario();
    if (usuario) {
        if (Auth.precisaEscolherPerfil()) {
            mostrarSelecaoPerfil();
        } else {
            mostrarDashboard();
        }
    } else {
        mostrarTelaLogin();
    }
    
    $('#btn-escolher-proprietario').click(() => {
        const usuario = Auth.getUsuario();
        const isProprietario = usuario && (usuario.isProprietario === true || usuario.proprietario === true);
        if (isProprietario) {
            Auth.setPerfilAtivo('PROPRIETARIO');
            mostrarDashboard();
        } else {
            mostrarMensagem('Você não possui permissão de proprietário!', 'error');
        }
    });
    
    $('#btn-escolher-inquilino').click(() => {
        const usuario = Auth.getUsuario();
        const isInquilino = usuario && (usuario.isInquilino === true || usuario.inquilino === true);
        if (isInquilino) {
            Auth.setPerfilAtivo('INQUILINO');
            mostrarDashboard();
        } else {
            mostrarMensagem('Você não possui permissão de inquilino!', 'error');
        }
    });
    
    $('#form-login-unificado').submit(handleLogin);
    
    $('#email-login, #senha-login').on('blur', function() {
        const campoId = $(this).attr('id');
        const valor = $(this).val();
        
        if (campoId === 'email-login') {
            const validacao = Validations.usuario.email(valor);
            if (!validacao.valido) {
                Validations.mostrarErro(campoId, validacao.mensagem);
            } else {
                Validations.removerErro(campoId);
            }
        } else if (campoId === 'senha-login') {
            const validacao = Validations.usuario.senha(valor);
            if (!validacao.valido) {
                Validations.mostrarErro(campoId, validacao.mensagem);
            } else {
                Validations.removerErro(campoId);
            }
        }
    });
    
    $('#btn-mostrar-cadastro').click(() => {
        $('#form-login').addClass('hidden');
        $('#form-cadastro').removeClass('hidden');
    });
    
    $('#form-cadastro-unificado').submit(handleCadastro);
    
    $('input[name="tipo-perfil"]').on('change', function() {
        $('.opcao-perfil').removeClass('selected');
        $(this).closest('.opcao-perfil').addClass('selected');
    });
    
    $('#nome-cadastro').on('blur', function() {
        const validacao = Validations.usuario.nome($(this).val());
        if (!validacao.valido) {
            Validations.mostrarErro('nome-cadastro', validacao.mensagem);
        } else {
            Validations.removerErro('nome-cadastro');
        }
    });
    $('#email-cadastro').on('blur', function() {
        const validacao = Validations.usuario.email($(this).val());
        if (!validacao.valido) {
            Validations.mostrarErro('email-cadastro', validacao.mensagem);
        } else {
            Validations.removerErro('email-cadastro');
        }
    });
    $('#senha-cadastro').on('blur', function() {
        const validacao = Validations.usuario.senha($(this).val());
        if (!validacao.valido) {
            Validations.mostrarErro('senha-cadastro', validacao.mensagem);
        } else {
            Validations.removerErro('senha-cadastro');
        }
    });
    
    $('#btn-voltar-login').click(() => {
        $('#form-cadastro').addClass('hidden');
        $('#form-login').removeClass('hidden');
    });
    
    $('#btn-cadastrar-propriedade').click(() => {
        ocultarTodosConteudos();
        $('#form-cadastro-propriedade').removeClass('hidden');
    });
    
    $('#form-nova-propriedade').submit(handleCadastrarPropriedade);
    $('#btn-cancelar-propriedade').click(() => {
        $('#form-cadastro-propriedade').addClass('hidden');
        limparFotos();
        Validations.removerErro('titulo-propriedade');
        Validations.removerErro('descricao-propriedade');
        Validations.removerErro('localizacao-propriedade');
        Validations.removerErro('capacidade-propriedade');
        Validations.removerErro('preco-propriedade');
    });

    $('#form-editar-propriedade').submit(handleEditarPropriedade);
    $('#btn-cancelar-edicao-propriedade').click(() => {
        $('#form-edicao-propriedade').addClass('hidden');
        limparFotosEdit();
        Validations.removerErro('titulo-propriedade-edit');
        Validations.removerErro('descricao-propriedade-edit');
        Validations.removerErro('localizacao-propriedade-edit');
        Validations.removerErro('capacidade-propriedade-edit');
        Validations.removerErro('preco-propriedade-edit');
    });

    $('#fotos-propriedade-input-edit').change(function() {
        previewFotosEdit(this.files);
    });

    aplicarMascaras();
    
    $('#titulo-propriedade').on('blur', function() {
        const validacao = Validations.propriedade.titulo($(this).val());
        if (!validacao.valido) {
            Validations.mostrarErro('titulo-propriedade', validacao.mensagem);
        } else {
            Validations.removerErro('titulo-propriedade');
        }
    });
    $('#descricao-propriedade').on('blur', function() {
        const validacao = Validations.propriedade.descricao($(this).val());
        if (!validacao.valido) {
            Validations.mostrarErro('descricao-propriedade', validacao.mensagem);
        } else {
            Validations.removerErro('descricao-propriedade');
        }
    });
    $('#localizacao-propriedade').on('blur', function() {
        const validacao = Validations.propriedade.localizacao($(this).val());
        if (!validacao.valido) {
            Validations.mostrarErro('localizacao-propriedade', validacao.mensagem);
        } else {
            Validations.removerErro('localizacao-propriedade');
        }
    });
    $('#capacidade-propriedade').on('blur', function() {
        const validacao = Validations.propriedade.capacidade($(this).val());
        if (!validacao.valido) {
            Validations.mostrarErro('capacidade-propriedade', validacao.mensagem);
        } else {
            Validations.removerErro('capacidade-propriedade');
        }
    });
    $('#preco-propriedade').on('blur', function() {
        const validacao = Validations.propriedade.precoPorNoite($(this).val());
        if (!validacao.valido) {
            Validations.mostrarErro('preco-propriedade', validacao.mensagem);
        } else {
            Validations.removerErro('preco-propriedade');
        }
    });
    
    $('#fotos-propriedade-input').change(function() {
        previewFotos(this.files);
    });
    
    $('#btn-listar-propriedades').click(() => {
        ocultarTodosConteudos();
        carregarPropriedadesProprietario();
    });
    
    $('#btn-propriedades-alugadas').click(() => {
        ocultarTodosConteudos();
        carregarPropriedadesAlugadas();
    });
    
    $('#btn-buscar-propriedades').click(() => {
        ocultarTodosConteudos();
        $('#busca-propriedades').removeClass('hidden');
        carregarTodasPropriedadesDisponiveis();
    });
    
    $('#btn-minhas-reservas').click(() => {
        ocultarTodosConteudos();
        carregarMinhasReservas();
    });
    
    $('#form-nova-reserva').submit(handleFazerReserva);
    $('#btn-cancelar-reserva').click(() => {
        $('#form-reserva').addClass('hidden');
    });
    
    $('#data-checkin-reserva, #data-checkout-reserva').change(() => {
        calcularCustoReserva();
    });
    
    $('#data-checkin-reserva, #data-checkout-reserva').on('change', function() {
        const dataCheckin = $('#data-checkin-reserva').val();
        const dataCheckout = $('#data-checkout-reserva').val();
        
        if (dataCheckin && dataCheckout) {
            const validacao = Validations.reserva.validarDatas(dataCheckin, dataCheckout);
            if (!validacao.valido) {
                if (validacao.mensagem.includes('check-in')) {
                    Validations.mostrarErro('data-checkin-reserva', validacao.mensagem);
                    Validations.removerErro('data-checkout-reserva');
                } else {
                    Validations.mostrarErro('data-checkout-reserva', validacao.mensagem);
                    Validations.removerErro('data-checkin-reserva');
                }
            } else {
                Validations.removerErro('data-checkin-reserva');
                Validations.removerErro('data-checkout-reserva');
            }
        }
    });
    
    $('#btn-trocar-perfil').click(() => {
        localStorage.removeItem('perfilAtivo');
        mostrarSelecaoPerfil();
    });
    
    $('#btn-logout').click(() => {
        Auth.logout();
        mostrarTelaLogin();
    });
});

function mostrarTelaLogin() {
    $('#tela-login').removeClass('hidden');
    $('#dashboard').addClass('hidden');
    $('#selecao-perfil').addClass('hidden');
    $('#form-login-unificado')[0].reset();
    $('#form-cadastro-unificado')[0].reset();
    Validations.removerErro('email-login');
    Validations.removerErro('senha-login');
    Validations.removerErro('nome-cadastro');
    Validations.removerErro('email-cadastro');
    Validations.removerErro('senha-cadastro');
}

function mostrarSelecaoPerfil() {
    $('#tela-login').addClass('hidden');
    $('#dashboard').removeClass('hidden');
    $('#selecao-perfil').removeClass('hidden');
    $('#menu-proprietario').addClass('hidden');
    $('#menu-inquilino').addClass('hidden');
    ocultarTodosConteudos();
    
    const usuario = Auth.getUsuario();
    if (usuario) {
        $('#nome-usuario').text(`Olá, ${usuario.nome}!`);
        $('#btn-trocar-perfil').addClass('hidden');
    }
    
    const isProprietario = usuario && (usuario.isProprietario === true || usuario.proprietario === true);
    if (isProprietario) {
        $('#btn-escolher-proprietario').removeClass('hidden');
    } else {
        $('#btn-escolher-proprietario').addClass('hidden');
    }
    
    const isInquilino = usuario && (usuario.isInquilino === true || usuario.inquilino === true);
    if (isInquilino) {
        $('#btn-escolher-inquilino').removeClass('hidden');
    } else {
        $('#btn-escolher-inquilino').addClass('hidden');
    }
    
    console.log('Usuário logado:', usuario);
    console.log('isProprietario:', usuario?.isProprietario, 'proprietario:', usuario?.proprietario);
    console.log('isInquilino:', usuario?.isInquilino, 'inquilino:', usuario?.inquilino);
}

function mostrarDashboard() {
    $('#tela-login').addClass('hidden');
    $('#dashboard').removeClass('hidden');
    $('#selecao-perfil').addClass('hidden');
    
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarTelaLogin();
        return;
    }
    
    if (Auth.precisaEscolherPerfil()) {
        mostrarSelecaoPerfil();
        return;
    }
    
    $('#nome-usuario').text(`Olá, ${usuario.nome}!`);
    
    const isProprietario = usuario.isProprietario === true || usuario.proprietario === true;
    const isInquilino = usuario.isInquilino === true || usuario.inquilino === true;
    
    if (isProprietario && isInquilino) {
        $('#btn-trocar-perfil').removeClass('hidden');
    } else {
        $('#btn-trocar-perfil').addClass('hidden');
    }
    
    if (Auth.podeAcessarComoProprietario()) {
        $('#menu-proprietario').removeClass('hidden');
        $('#menu-inquilino').addClass('hidden');
    } else if (Auth.podeAcessarComoInquilino()) {
        $('#menu-proprietario').addClass('hidden');
        $('#menu-inquilino').removeClass('hidden');
    } else {
        mostrarSelecaoPerfil();
        return;
    }
    
    ocultarTodosConteudos();
}

function ocultarTodosConteudos() {
    $('#form-cadastro-propriedade').addClass('hidden');
    $('#form-edicao-propriedade').addClass('hidden');
    $('#lista-propriedades-proprietario').addClass('hidden');
    $('#busca-propriedades').addClass('hidden');
    $('#form-reserva').addClass('hidden');
    $('#minhas-reservas').addClass('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    
    Validations.removerErro('email-login');
    Validations.removerErro('senha-login');
    
    const email = $('#email-login').val();
    const senha = $('#senha-login').val();
    
    const validacaoEmail = Validations.usuario.email(email);
    const validacaoSenha = Validations.usuario.senha(senha);
    
    if (!validacaoEmail.valido || !validacaoSenha.valido) {
        if (!validacaoEmail.valido) {
            Validations.mostrarErro('email-login', validacaoEmail.mensagem);
        }
        if (!validacaoSenha.valido) {
            Validations.mostrarErro('senha-login', validacaoSenha.mensagem);
        }
        return;
    }
    
    UsuarioAPI.login(email, senha)
        .done((usuario) => {
            Auth.setUsuario(usuario);
            mostrarMensagem('Login realizado com sucesso!', 'success');
            
            localStorage.removeItem('perfilAtivo');
            
            if (Auth.precisaEscolherPerfil()) {
                mostrarSelecaoPerfil();
            } else {
                const isProprietario = usuario.isProprietario === true || usuario.proprietario === true;
                const isInquilino = usuario.isInquilino === true || usuario.inquilino === true;
                
                if (isProprietario && !isInquilino) {
                    Auth.setPerfilAtivo('PROPRIETARIO');
                } else if (isInquilino && !isProprietario) {
                    Auth.setPerfilAtivo('INQUILINO');
                }
                mostrarDashboard();
            }
        })
        .fail((xhr) => {
            mostrarMensagem('Erro ao fazer login: ' + (xhr.responseJSON?.erro || 'Credenciais inválidas'), 'error');
        });
}

function handleCadastro(e) {
    e.preventDefault();
    
    Validations.removerErro('nome-cadastro');
    Validations.removerErro('email-cadastro');
    Validations.removerErro('senha-cadastro');
    
    const nome = $('#nome-cadastro').val();
    const email = $('#email-cadastro').val();
    const senha = $('#senha-cadastro').val();
    const tipoPerfil = $('input[name="tipo-perfil"]:checked').val();
    
    if (!tipoPerfil) {
        mostrarMensagem('Por favor, selecione um tipo de perfil!', 'error');
        return;
    }
    
    const validacaoNome = Validations.usuario.nome(nome);
    const validacaoEmail = Validations.usuario.email(email);
    const validacaoSenha = Validations.usuario.senha(senha);
    
    const validacoes = {
        'nome-cadastro': validacaoNome,
        'email-cadastro': validacaoEmail,
        'senha-cadastro': validacaoSenha
    };
    
    if (!Validations.validarFormulario(validacoes)) {
        return;
    }
    
    const dados = { nome, email, senha };
    
    let promessaCadastro;
    
    if (tipoPerfil === 'proprietario') {
        promessaCadastro = UsuarioAPI.cadastrarProprietario(dados);
    } else if (tipoPerfil === 'inquilino') {
        promessaCadastro = UsuarioAPI.cadastrarInquilino(dados);
    } else if (tipoPerfil === 'ambos') {
        promessaCadastro = UsuarioAPI.cadastrarProprietario(dados)
            .then((usuario) => {
                return UsuarioAPI.cadastrarInquilino(dados);
            });
    } else {
        mostrarMensagem('Tipo de perfil inválido!', 'error');
        return;
    }
    
    promessaCadastro
        .done((usuario) => {
            mostrarMensagem('Cadastro realizado com sucesso!', 'success');
            $('#form-cadastro').addClass('hidden');
            $('#form-login').removeClass('hidden');
            $('#form-cadastro-unificado')[0].reset();
            Validations.removerErro('nome-cadastro');
            Validations.removerErro('email-cadastro');
            Validations.removerErro('senha-cadastro');
        })
        .fail((xhr) => {
            const erro = xhr.responseJSON?.erro || xhr.responseJSON || 'Erro desconhecido';
            mostrarMensagem('Erro ao cadastrar: ' + (typeof erro === 'string' ? erro : JSON.stringify(erro)), 'error');
        });
}

function handleCadastrarPropriedade(e) {
    e.preventDefault();
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    if (!Auth.podeAcessarComoProprietario()) {
        mostrarMensagem('Você precisa estar acessando como Proprietário!', 'error');
        return;
    }
    
    Validations.removerErro('titulo-propriedade');
    Validations.removerErro('descricao-propriedade');
    Validations.removerErro('localizacao-propriedade');
    Validations.removerErro('capacidade-propriedade');
    Validations.removerErro('preco-propriedade');
    
    const titulo = $('#titulo-propriedade').val();
    const descricao = $('#descricao-propriedade').val();
    const localizacao = $('#localizacao-propriedade').val();
    const capacidade = $('#capacidade-propriedade').val();
    const preco = $('#preco-propriedade').val();
    
    const validacaoTitulo = Validations.propriedade.titulo(titulo);
    const validacaoDescricao = Validations.propriedade.descricao(descricao);
    const validacaoLocalizacao = Validations.propriedade.localizacao(localizacao);
    const validacaoCapacidade = Validations.propriedade.capacidade(capacidade);
    const validacaoPreco = Validations.propriedade.precoPorNoite(preco);
    
    const validacoes = {
        'titulo-propriedade': validacaoTitulo,
        'descricao-propriedade': validacaoDescricao,
        'localizacao-propriedade': validacaoLocalizacao,
        'capacidade-propriedade': validacaoCapacidade,
        'preco-propriedade': validacaoPreco
    };
    
    if (!Validations.validarFormulario(validacoes)) {
        return;
    }
    
    const fileInput = document.getElementById('fotos-propriedade-input');
    const files = fileInput.files;
    
    if (files && files.length > 0) {
        fazerUploadFotos(files, (urls) => {
            cadastrarPropriedadeComFotos(urls);
        });
    } else {
        cadastrarPropriedadeComFotos([]);
    }
}

function fazerUploadFotos(files, callback) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    
    mostrarMensagem('Fazendo upload das fotos...', 'success');
    
    $.ajax({
        url: '/api/upload/fotos',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function(response) {
            if (response.urls && response.urls.length > 0) {
                callback(response.urls);
            } else {
                mostrarMensagem('Nenhuma foto foi enviada com sucesso', 'error');
            }
        },
        error: function(xhr) {
            const erro = xhr.responseJSON?.erro || 'Erro ao fazer upload das fotos';
            mostrarMensagem(erro, 'error');
        }
    });
}

function cadastrarPropriedadeComFotos(fotosUrls) {
    const usuario = Auth.getUsuario();
    
    const precoStr = $('#preco-propriedade').val().replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
    
    const propriedade = {
        titulo: $('#titulo-propriedade').val(),
        descricao: $('#descricao-propriedade').val(),
        localizacao: $('#localizacao-propriedade').val(),
        capacidade: parseInt($('#capacidade-propriedade').val().replace(/\D/g, '')),
        precoPorNoite: parseFloat(precoStr) || 0,
        fotos: fotosUrls
    };
    
    PropriedadeAPI.cadastrar(propriedade, usuario.id)
        .done(() => {
            mostrarMensagem('Propriedade cadastrada com sucesso!', 'success');
            $('#form-nova-propriedade')[0].reset();
            limparFotos();
            Validations.removerErro('titulo-propriedade');
            Validations.removerErro('descricao-propriedade');
            Validations.removerErro('localizacao-propriedade');
            Validations.removerErro('capacidade-propriedade');
            Validations.removerErro('preco-propriedade');
            $('#form-cadastro-propriedade').addClass('hidden');
        })
        .fail((xhr) => {
            const erro = xhr.responseJSON?.erro || xhr.responseJSON || 'Erro desconhecido';
            mostrarMensagem('Erro ao cadastrar: ' + (typeof erro === 'string' ? erro : JSON.stringify(erro)), 'error');
        });
}

function previewFotos(files) {
    const preview = $('#preview-fotos');
    preview.empty();
    
    if (!files || files.length === 0) {
        return;
    }
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = $('<img>').attr('src', e.target.result).addClass('preview-img');
                const div = $('<div>').addClass('preview-item').append(img);
                preview.append(div);
            };
            reader.readAsDataURL(file);
        }
    }
}

function limparFotos() {
    $('#fotos-propriedade-input').val('');
    $('#preview-fotos').empty();
}

function carregarPropriedadesProprietario() {
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    if (!Auth.podeAcessarComoProprietario()) {
        mostrarMensagem('Você precisa estar acessando como Proprietário!', 'error');
        return;
    }
    
    PropriedadeAPI.listarPorProprietario(usuario.id)
        .done((propriedades) => {
            renderizarPropriedades(propriedades, '#propriedades-container-proprietario', true);
            $('#lista-propriedades-proprietario').removeClass('hidden');
        })
        .fail((xhr) => {
            mostrarMensagem('Erro ao carregar propriedades', 'error');
        });
}

function carregarPropriedadesAlugadas() {
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    if (!Auth.podeAcessarComoProprietario()) {
        mostrarMensagem('Você precisa estar acessando como Proprietário!', 'error');
        return;
    }
    
    PropriedadeAPI.listarAlugadas(usuario.id)
        .done((propriedades) => {
            renderizarPropriedades(propriedades, '#propriedades-container-proprietario', true);
            $('#lista-propriedades-proprietario').removeClass('hidden');
        })
        .fail((xhr) => {
            mostrarMensagem('Erro ao carregar propriedades', 'error');
        });
}

function carregarTodasPropriedadesDisponiveis() {
    if (!Auth.podeAcessarComoInquilino()) {
        mostrarMensagem('Você precisa estar acessando como Inquilino para buscar propriedades!', 'error');
        return;
    }
    
    ReservaAPI.buscarDisponiveis(null, null, null)
        .done((propriedades) => {
            renderizarPropriedades(propriedades, '#propriedades-container-usuario', false);
        })
        .fail((xhr) => {
            const erro = xhr.responseJSON?.erro || xhr.responseJSON || 'Erro desconhecido';
            mostrarMensagem('Erro ao carregar propriedades: ' + (typeof erro === 'string' ? erro : JSON.stringify(erro)), 'error');
        });
}

let propriedadeSelecionada = null;

function abrirFormReserva(propriedadeId) {
    if (!Auth.podeAcessarComoInquilino()) {
        mostrarMensagem('Você precisa estar acessando como Inquilino para fazer reservas!', 'error');
        return;
    }
    
    PropriedadeAPI.buscarPorId(propriedadeId)
        .done((propriedade) => {
            propriedadeSelecionada = propriedade;
            
            let fotosHtml = '';
            if (propriedade.fotos && propriedade.fotos.length > 0) {
                fotosHtml = '<div class="fotos-galeria">';
                propriedade.fotos.forEach(url => {
                    fotosHtml += `<img src="${url}" alt="Foto da propriedade" class="foto-miniatura">`;
                });
                fotosHtml += '</div>';
            }
            
            $('#detalhes-propriedade-reserva').html(`
                <div class="propriedade-card">
                    <h4>${propriedade.titulo}</h4>
                    <p>${propriedade.descricao}</p>
                    <p><strong>Localização:</strong> ${propriedade.localizacao}</p>
                    <p><strong>Capacidade:</strong> ${propriedade.capacidade} pessoa(s)</p>
                    <p><strong>Preço por noite:</strong> R$ ${propriedade.precoPorNoite.toFixed(2)}</p>
                    ${fotosHtml}
                </div>
            `);
            $('#form-reserva').data('propriedade-id', propriedadeId);
            ocultarTodosConteudos();
            $('#form-reserva').removeClass('hidden');
            calcularCustoReserva();
        })
        .fail((xhr) => {
            mostrarMensagem('Erro ao carregar propriedade', 'error');
        });
}

function calcularCustoReserva() {
    if (!propriedadeSelecionada) return;
    
    const checkin = $('#data-checkin-reserva').val();
    const checkout = $('#data-checkout-reserva').val();
    
    Validations.removerErro('data-checkin-reserva');
    Validations.removerErro('data-checkout-reserva');
    
    if (checkin && checkout) {
        const validacaoDatas = Validations.reserva.validarDatas(checkin, checkout);
        if (!validacaoDatas.valido) {
            if (validacaoDatas.mensagem.includes('check-in')) {
                Validations.mostrarErro('data-checkin-reserva', validacaoDatas.mensagem);
            } else {
                Validations.mostrarErro('data-checkout-reserva', validacaoDatas.mensagem);
            }
            $('#custo-total-reserva').html(`<p class="erro">${validacaoDatas.mensagem}</p>`);
            return;
        }
        
        const dataInicio = new Date(checkin);
        const dataFim = new Date(checkout);
        const diffTime = Math.abs(dataFim - dataInicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            const custoTotal = diffDays * propriedadeSelecionada.precoPorNoite;
            $('#custo-total-reserva').html(`
                <div class="custo-info">
                    <p><strong>Número de noites:</strong> ${diffDays}</p>
                    <p><strong>Custo Total:</strong> R$ ${custoTotal.toFixed(2)}</p>
                </div>
            `);
        }
    }
}

function handleFazerReserva(e) {
    e.preventDefault();
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    if (!Auth.podeAcessarComoInquilino()) {
        mostrarMensagem('Você precisa estar acessando como Inquilino para fazer reservas!', 'error');
        return;
    }
    
    Validations.removerErro('data-checkin-reserva');
    Validations.removerErro('data-checkout-reserva');
    
    const dataCheckin = $('#data-checkin-reserva').val();
    const dataCheckout = $('#data-checkout-reserva').val();
    
    const validacaoDatas = Validations.reserva.validarDatas(dataCheckin, dataCheckout);
    if (!validacaoDatas.valido) {
        if (validacaoDatas.mensagem.includes('check-in')) {
            Validations.mostrarErro('data-checkin-reserva', validacaoDatas.mensagem);
        } else {
            Validations.mostrarErro('data-checkout-reserva', validacaoDatas.mensagem);
        }
        return;
    }
    
    const propriedadeId = $('#form-reserva').data('propriedade-id');
    const reserva = {
        dataCheckin: dataCheckin,
        dataCheckout: dataCheckout
    };
    
    ReservaAPI.fazerReserva(reserva, usuario.id, propriedadeId)
        .done((reservaCriada) => {
            mostrarMensagem('Reserva realizada com sucesso!', 'success');
            $('#form-reserva').addClass('hidden');
            $('#form-nova-reserva')[0].reset();
            propriedadeSelecionada = null;
            carregarMinhasReservas();
        })
        .fail((xhr) => {
            const erro = xhr.responseJSON?.erro || xhr.responseJSON || 'Erro desconhecido';
            mostrarMensagem('Erro ao fazer reserva: ' + (typeof erro === 'string' ? erro : JSON.stringify(erro)), 'error');
        });
}

function carregarMinhasReservas() {
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    if (!Auth.podeAcessarComoInquilino()) {
        mostrarMensagem('Você precisa estar acessando como Inquilino!', 'error');
        return;
    }
    
    ReservaAPI.listarPorInquilino(usuario.id)
        .done((reservas) => {
            renderizarReservas(reservas);
            ocultarTodosConteudos();
            $('#minhas-reservas').removeClass('hidden');
        })
        .fail((xhr) => {
            mostrarMensagem('Erro ao carregar reservas', 'error');
        });
}

let propriedadeParaEditar = null;
let propriedadeIdParaDeletar = null;

function renderizarPropriedades(propriedades, container, isProprietario) {
    let html = '';
    const usuario = Auth.getUsuario();
    const usuarioId = usuario ? usuario.id : null;
    
    if (propriedades.length === 0) {
        html = '<p class="sem-dados">Nenhuma propriedade encontrada.</p>';
    } else {
        html += '<div class="cards-grid">';
        propriedades.forEach(prop => {
            const imagemPrincipal = (prop.fotos && prop.fotos.length > 0) 
                ? prop.fotos[0] 
                : 'https://via.placeholder.com/400x300?text=Sem+Imagem';
            
            const highlightBadge = prop.destaque ? '<div class="card-highlight-badge">Destaque</div>' : '';
            
            let reservaInfoHtml = '';
            if (!prop.disponivel && prop.reservaAtiva && isProprietario) {
                const reserva = prop.reservaAtiva;
                reservaInfoHtml = `
                    <div style="margin-top: 16px; padding: 16px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #cd1f42;">
                        <p style="margin: 0 0 8px 0; font-weight: 600; color: #1a1a1a;">Informações da Reserva</p>
                        <p style="margin: 4px 0; font-size: 0.9em; color: #495057;"><strong>Inquilino:</strong> ${reserva.inquilinoNome}</p>
                        <p style="margin: 4px 0; font-size: 0.9em; color: #495057;"><strong>Email:</strong> ${reserva.inquilinoEmail}</p>
                        <p style="margin: 4px 0; font-size: 0.9em; color: #495057;"><strong>Período:</strong> ${reserva.dataCheckin} até ${reserva.dataCheckout}</p>
                        <p style="margin: 4px 0; font-size: 0.9em; color: #495057;"><strong>Duração:</strong> ${reserva.dias} dia(s)</p>
                    </div>
                `;
            }
            
            const temReservaAtiva = !prop.disponivel && prop.reservaAtiva;
            
            let acoesProprietario = '';
            if (isProprietario) {
                if (temReservaAtiva) {
                    acoesProprietario = `
                        <div style="margin-top: 12px; display: flex; gap: 8px;">
                            <button class="btn-secondary btn-editar" style="flex: 1; background: #6c757d; cursor: not-allowed;" disabled>
                                Reservada
                            </button>
                            <button class="btn-secondary" style="flex: 1; background: #6c757d; cursor: not-allowed;" disabled>
                                Reservada
                            </button>
                        </div>
                    `;
                } else {
                    acoesProprietario = `
                        <div style="margin-top: 12px; display: flex; gap: 8px;">
                            <button onclick="abrirFormEdicao(${prop.id})" class="btn-secondary btn-editar" style="flex: 1;">
                                Editar
                            </button>
                            <button onclick="abrirModalDeletarPropriedade(${prop.id})" class="btn-secondary" style="flex: 1; background: #dc3545;">
                                Remover
                            </button>
                        </div>
                    `;
                }
            }
            
            const isProprietarioDestaPropriedade = prop.proprietarioId && usuarioId && prop.proprietarioId === usuarioId;
            
            let botaoReserva = '';
            if (isProprietarioDestaPropriedade) {
                botaoReserva = '<button class="card-action-btn" disabled style="background: #6c757d; cursor: not-allowed;">Sua Propriedade</button>';
            } else if (prop.disponivel) {
                botaoReserva = `<button onclick="abrirFormReserva(${prop.id})" class="card-action-btn">Reservar Agora</button>`;
            } else {
                botaoReserva = '<button class="card-action-btn" disabled style="background: #6c757d; cursor: not-allowed;">Indisponível</button>';
            }
            
            html += `
                <div class="propriedade-card">
                    <div class="card-image-wrapper">
                        <img src="${imagemPrincipal}" alt="${prop.titulo}" class="card-featured-image">
                        
                        ${highlightBadge}
                        
                        ${prop.fotos && prop.fotos.length > 1 ? 
                            `<div class="card-gallery-indicator">${prop.fotos.length} fotos</div>` : ''}
                        
                        <div class="card-status-tag ${prop.disponivel ? 'disponivel' : 'alugada'}">
                            ${prop.disponivel ? 'Disponível' : 'Alugada'}
                        </div>
                    </div>
                    
                    <div class="card-content">
                        <div class="card-property-type">${prop.tipo || 'Casa'}</div>
                        
                        <h3 class="card-title">${prop.titulo}</h3>
                        
                        <div class="card-location">${prop.localizacao}</div>
                        
                        <p class="card-description">${prop.descricao}</p>
                        
                        ${reservaInfoHtml}
                        
                        <div class="card-footer">
                            <div class="card-price-section">
                                <span class="card-price-label">A partir de</span>
                                <div class="card-price-wrapper">
                                    <span class="card-price-currency">R$</span>
                                    <span class="card-price">${prop.precoPorNoite.toFixed(0)}</span>
                                    <span class="card-price-night">/noite</span>
                                </div>
                            </div>
                            ${botaoReserva}
                        </div>
                        ${acoesProprietario}
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    $(container).html(html);
}

let reservaIdParaCancelar = null;

function renderizarReservas(reservas) {
    let html = '';
    if (reservas.length === 0) {
        html = '<p class="sem-dados">Você não possui reservas no momento.</p>';
    } else {
        reservas.forEach(reserva => {
            const propriedadeInfo = reserva.propriedadeInfo || reserva.propriedade;
            html += `
                <div class="reserva-card">
                    <h4>${propriedadeInfo ? propriedadeInfo.titulo : 'Propriedade'}</h4>
                    <p><strong>Localização:</strong> ${propriedadeInfo ? propriedadeInfo.localizacao : 'N/A'}</p>
                    <p><strong>Check-in:</strong> ${formatarData(reserva.dataCheckin)}</p>
                    <p><strong>Check-out:</strong> ${formatarData(reserva.dataCheckout)}</p>
                    <p><strong>Custo Total:</strong> R$ ${reserva.custoTotal ? reserva.custoTotal.toFixed(2) : '0.00'}</p>
                    <button onclick="abrirModalCancelar(${reserva.id})" class="btn-secondary">
                        Cancelar Reserva
                    </button>
                </div>
            `;
        });
    }
    $('#reservas-container').html(html);
}

function formatarData(data) {
    if (!data) return 'N/A';
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

function abrirModalCancelar(id) {
    reservaIdParaCancelar = id;
    $('#modal-cancelar').addClass('active');
    $('body').css('overflow', 'hidden');
}

function fecharModalCancelar() {
    $('#modal-cancelar').removeClass('active');
    $('body').css('overflow', 'auto');
    reservaIdParaCancelar = null;
}

function confirmarCancelamento() {
    if (reservaIdParaCancelar === null) return;
    
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    const id = reservaIdParaCancelar;
    fecharModalCancelar();
    
    ReservaAPI.deletar(id, usuario.id)
        .done(() => {
            mostrarMensagem('Reserva cancelada com sucesso!', 'success');
            carregarMinhasReservas();
        })
        .fail((xhr) => {
            const erro = xhr.responseJSON?.erro || xhr.responseJSON || 'Erro desconhecido';
            mostrarMensagem('Erro ao cancelar reserva: ' + (typeof erro === 'string' ? erro : JSON.stringify(erro)), 'error');
        });
}

$(document).on('click', '.modal-overlay', function(e) {
    if (e.target === this) {
        fecharModalCancelar();
    }
});

$(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $('#modal-cancelar').hasClass('active')) {
        fecharModalCancelar();
    }
});

function mostrarMensagem(texto, tipo) {
    const mensagem = $('#mensagem');
    mensagem.removeClass('hidden success error').addClass(tipo);
    mensagem.text(texto);
    setTimeout(() => {
        mensagem.addClass('hidden');
    }, 5000);
}

function abrirFormEdicao(propriedadeId) {
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    if (!Auth.podeAcessarComoProprietario()) {
        mostrarMensagem('Você precisa estar acessando como Proprietário!', 'error');
        return;
    }
    
    PropriedadeAPI.buscarPorId(propriedadeId)
        .done((propriedade) => {
            propriedadeParaEditar = propriedade;
            
            $('#titulo-propriedade-edit').val(propriedade.titulo);
            $('#descricao-propriedade-edit').val(propriedade.descricao);
            $('#localizacao-propriedade-edit').val(propriedade.localizacao);
            $('#capacidade-propriedade-edit').val(propriedade.capacidade);
            const precoNum = parseFloat(propriedade.precoPorNoite) || 0;
            const precoFormatado = 'R$ ' + precoNum.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            $('#preco-propriedade-edit').val(precoFormatado);
            
            setTimeout(() => {
                aplicarMascaras();
            }, 100);
            
            if (propriedade.fotos && propriedade.fotos.length > 0) {
                let fotosHtml = '';
                propriedade.fotos.forEach(url => {
                    fotosHtml += `<div class="preview-item"><img src="${url}" class="preview-img"><button type="button" onclick="removerFotoEdit('${url}')" class="btn-remover-foto">×</button></div>`;
                });
                $('#preview-fotos-edit').html(fotosHtml);
            } else {
                $('#preview-fotos-edit').empty();
            }
            
            $('#form-edicao-propriedade').data('propriedade-id', propriedadeId);
            ocultarTodosConteudos();
            $('#form-edicao-propriedade').removeClass('hidden');
        })
        .fail((xhr) => {
            mostrarMensagem('Erro ao carregar propriedade', 'error');
        });
}

function removerFotoEdit(url) {
    if (propriedadeParaEditar && propriedadeParaEditar.fotos) {
        propriedadeParaEditar.fotos = propriedadeParaEditar.fotos.filter(f => f !== url);
        abrirFormEdicao(propriedadeParaEditar.id);
    }
}

function handleEditarPropriedade(e) {
    e.preventDefault();
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    if (!Auth.podeAcessarComoProprietario()) {
        mostrarMensagem('Você precisa estar acessando como Proprietário!', 'error');
        return;
    }
    
    Validations.removerErro('titulo-propriedade-edit');
    Validations.removerErro('descricao-propriedade-edit');
    Validations.removerErro('localizacao-propriedade-edit');
    Validations.removerErro('capacidade-propriedade-edit');
    Validations.removerErro('preco-propriedade-edit');
    
    const titulo = $('#titulo-propriedade-edit').val();
    const descricao = $('#descricao-propriedade-edit').val();
    const localizacao = $('#localizacao-propriedade-edit').val();
    const capacidade = $('#capacidade-propriedade-edit').val();
    const preco = $('#preco-propriedade-edit').val();
    
    const validacaoTitulo = Validations.propriedade.titulo(titulo);
    const validacaoDescricao = Validations.propriedade.descricao(descricao);
    const validacaoLocalizacao = Validations.propriedade.localizacao(localizacao);
    const validacaoCapacidade = Validations.propriedade.capacidade(capacidade);
    const validacaoPreco = Validations.propriedade.precoPorNoite(preco);
    
    const validacoes = {
        'titulo-propriedade-edit': validacaoTitulo,
        'descricao-propriedade-edit': validacaoDescricao,
        'localizacao-propriedade-edit': validacaoLocalizacao,
        'capacidade-propriedade-edit': validacaoCapacidade,
        'preco-propriedade-edit': validacaoPreco
    };
    
    if (!Validations.validarFormulario(validacoes)) {
        return;
    }
    
    const propriedadeId = $('#form-edicao-propriedade').data('propriedade-id');
    
    let fotosExistentes = [];
    if (propriedadeParaEditar && propriedadeParaEditar.fotos) {
        fotosExistentes = propriedadeParaEditar.fotos;
    }
    
    const fileInput = document.getElementById('fotos-propriedade-input-edit');
    const files = fileInput.files;
    
    if (files && files.length > 0) {
        fazerUploadFotos(files, (urls) => {
            const todasFotos = [...fotosExistentes, ...urls];
            atualizarPropriedadeComFotos(propriedadeId, todasFotos);
        });
    } else {
        atualizarPropriedadeComFotos(propriedadeId, fotosExistentes);
    }
}

function atualizarPropriedadeComFotos(propriedadeId, fotosUrls) {
    const usuario = Auth.getUsuario();
    
    const precoStr = $('#preco-propriedade-edit').val().replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
    
    const propriedade = {
        titulo: $('#titulo-propriedade-edit').val(),
        descricao: $('#descricao-propriedade-edit').val(),
        localizacao: $('#localizacao-propriedade-edit').val(),
        capacidade: parseInt($('#capacidade-propriedade-edit').val().replace(/\D/g, '')),
        precoPorNoite: parseFloat(precoStr) || 0,
        fotos: fotosUrls
    };
    
    PropriedadeAPI.atualizar(propriedadeId, propriedade, usuario.id)
        .done(() => {
            mostrarMensagem('Propriedade atualizada com sucesso!', 'success');
            $('#form-editar-propriedade')[0].reset();
            limparFotosEdit();
            Validations.removerErro('titulo-propriedade-edit');
            Validations.removerErro('descricao-propriedade-edit');
            Validations.removerErro('localizacao-propriedade-edit');
            Validations.removerErro('capacidade-propriedade-edit');
            Validations.removerErro('preco-propriedade-edit');
            $('#form-edicao-propriedade').addClass('hidden');
            propriedadeParaEditar = null;
            carregarPropriedadesProprietario();
        })
        .fail((xhr) => {
            const erro = xhr.responseJSON?.erro || xhr.responseJSON || 'Erro desconhecido';
            mostrarMensagem('Erro ao atualizar: ' + (typeof erro === 'string' ? erro : JSON.stringify(erro)), 'error');
        });
}

function limparFotosEdit() {
    $('#fotos-propriedade-input-edit').val('');
    $('#preview-fotos-edit').empty();
}

function previewFotosEdit(files) {
    const preview = $('#preview-fotos-edit');
    
    if (!files || files.length === 0) {
        return;
    }
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = $('<img>').attr('src', e.target.result).addClass('preview-img');
                const btnRemover = $('<button>').attr('type', 'button').addClass('btn-remover-foto').text('×');
                const div = $('<div>').addClass('preview-item').append(img).append(btnRemover);
                preview.append(div);
            };
            reader.readAsDataURL(file);
        }
    }
}

function abrirModalDeletarPropriedade(id) {
    propriedadeIdParaDeletar = id;
    $('#modal-deletar-propriedade').addClass('active');
    $('body').css('overflow', 'hidden');
}

function fecharModalDeletarPropriedade() {
    $('#modal-deletar-propriedade').removeClass('active');
    $('body').css('overflow', 'auto');
    propriedadeIdParaDeletar = null;
}

function confirmarDeletarPropriedade() {
    if (propriedadeIdParaDeletar === null) return;
    
    const usuario = Auth.getUsuario();
    if (!usuario) {
        mostrarMensagem('Você precisa estar logado!', 'error');
        return;
    }
    
    if (!Auth.podeAcessarComoProprietario()) {
        mostrarMensagem('Você precisa estar acessando como Proprietário!', 'error');
        return;
    }
    
    const id = propriedadeIdParaDeletar;
    fecharModalDeletarPropriedade();
    
    PropriedadeAPI.deletar(id, usuario.id)
        .done(() => {
            mostrarMensagem('Propriedade removida com sucesso!', 'success');
            carregarPropriedadesProprietario();
        })
        .fail((xhr) => {
            const erro = xhr.responseJSON?.erro || xhr.responseJSON || 'Erro desconhecido';
            mostrarMensagem('Erro ao remover propriedade: ' + (typeof erro === 'string' ? erro : JSON.stringify(erro)), 'error');
        });
}

$(document).on('click', '.modal-overlay', function(e) {
    if (e.target === this) {
        if ($('#modal-cancelar').hasClass('active')) {
            fecharModalCancelar();
        }
        if ($('#modal-deletar-propriedade').hasClass('active')) {
            fecharModalDeletarPropriedade();
        }
    }
});

$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        if ($('#modal-cancelar').hasClass('active')) {
            fecharModalCancelar();
        }
        if ($('#modal-deletar-propriedade').hasClass('active')) {
            fecharModalDeletarPropriedade();
        }
    }
});

function aplicarMascaras() {
    $('#preco-propriedade, #preco-propriedade-edit').mask('R$ 0.000,00', {
        reverse: true,
        translation: {
            '0': { pattern: /[0-9]/, optional: true }
        }
    });
    
    $('#capacidade-propriedade, #capacidade-propriedade-edit').mask('000', {
        reverse: false
    });
}
