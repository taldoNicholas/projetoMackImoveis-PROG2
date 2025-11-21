const API_BASE_URL = '';

function apiRequest(method, url, data = null) {
    return $.ajax({
        method: method,
        url: API_BASE_URL + url,
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        dataType: 'json',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    });
}

const UsuarioAPI = {
    cadastrarUsuario: (dados) => {
        return apiRequest('POST', '/usuarios', dados);
    },
    
    cadastrarProprietario: (dados) => {
        return apiRequest('POST', '/usuarios/proprietario', dados);
    },
    
    cadastrarInquilino: (dados) => {
        return apiRequest('POST', '/usuarios/inquilino', dados);
    },
    
    login: (email, senha) => {
        return apiRequest('POST', '/usuarios/login', { email, senha });
    },
    
    atualizarUsuario: (id, dados) => {
        return apiRequest('PUT', `/usuarios/${id}`, dados);
    }
};

const PropriedadeAPI = {
    listarTodas: () => {
        return apiRequest('GET', '/propriedades');
    },
    
    buscarPorId: (id) => {
        return apiRequest('GET', `/propriedades/${id}`);
    },
    
    listarDisponiveis: () => {
        return apiRequest('GET', '/propriedades/disponiveis');
    },
    
    buscarPorLocalizacao: (localizacao) => {
        return apiRequest('GET', `/propriedades/buscar?localizacao=${encodeURIComponent(localizacao)}`);
    },
    
    cadastrar: (propriedade, proprietarioId) => {
        return apiRequest('POST', `/propriedades?proprietarioId=${proprietarioId}`, propriedade);
    },
    
    atualizar: (id, propriedade, proprietarioId) => {
        return apiRequest('PUT', `/propriedades/${id}?proprietarioId=${proprietarioId}`, propriedade);
    },
    
    deletar: (id, proprietarioId) => {
        return $.ajax({
            method: 'DELETE',
            url: API_BASE_URL + `/propriedades/${id}?proprietarioId=${proprietarioId}`,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
    },
    
    listarPorProprietario: (proprietarioId) => {
        return apiRequest('GET', `/propriedades/minhas?proprietarioId=${proprietarioId}`);
    },
    
    listarAlugadas: (proprietarioId) => {
        return apiRequest('GET', `/propriedades/alugadas?proprietarioId=${proprietarioId}`);
    }
};

const ReservaAPI = {
    fazerReserva: (reserva, inquilinoId, propriedadeId) => {
        const url = `/reservas?inquilinoId=${inquilinoId}&propriedadeId=${propriedadeId}`;
        return apiRequest('POST', url, reserva);
    },
    
    listarPorInquilino: (inquilinoId) => {
        return apiRequest('GET', `/reservas?inquilinoId=${inquilinoId}`);
    },
    
    buscarDisponiveis: (dataCheckin, dataCheckout, localizacao = null) => {
        const params = [];
        
        if (dataCheckin) {
            params.push(`dataCheckin=${dataCheckin}`);
        }
        if (dataCheckout) {
            params.push(`dataCheckout=${dataCheckout}`);
        }
        if (localizacao) {
            params.push(`localizacao=${encodeURIComponent(localizacao)}`);
        }
        
        const url = params.length > 0 
            ? `/reservas/buscar?${params.join('&')}`
            : '/reservas/buscar';
        return apiRequest('GET', url);
    },
    
    deletar: (id, inquilinoId) => {
        return $.ajax({
            method: 'DELETE',
            url: API_BASE_URL + `/reservas/${id}?inquilinoId=${inquilinoId}`,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
    }
};

