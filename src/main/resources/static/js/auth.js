let usuarioLogado = null;

const Auth = {
    setUsuario: (usuario) => {
        usuarioLogado = usuario;
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    },
    
    getUsuario: () => {
        if (!usuarioLogado) {
            const stored = localStorage.getItem('usuarioLogado');
            if (stored) {
                usuarioLogado = JSON.parse(stored);
            }
        }
        return usuarioLogado;
    },
    
    logout: () => {
        usuarioLogado = null;
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('perfilAtivo');
    },
    
    isLoggedIn: () => {
        return Auth.getUsuario() !== null;
    },
    
    setPerfilAtivo: (perfil) => {
        localStorage.setItem('perfilAtivo', perfil);
    },
    
    getPerfilAtivo: () => {
        return localStorage.getItem('perfilAtivo');
    },
    
    precisaEscolherPerfil: () => {
        const usuario = Auth.getUsuario();
        if (!usuario) return false;
        
        const isProprietario = usuario.isProprietario === true || usuario.proprietario === true;
        const isInquilino = usuario.isInquilino === true || usuario.inquilino === true;
        
        if (isProprietario && isInquilino) {
            return !Auth.getPerfilAtivo();
        }
        
        return false;
    },
    
    podeAcessarComoProprietario: () => {
        const usuario = Auth.getUsuario();
        if (!usuario) return false;
        
        const isProprietario = usuario.isProprietario === true || usuario.proprietario === true;
        const isInquilino = usuario.isInquilino === true || usuario.inquilino === true;
        
        if (!isProprietario) return false;
        
        const perfilAtivo = Auth.getPerfilAtivo();
        if (isProprietario && isInquilino) {
            return perfilAtivo === 'PROPRIETARIO';
        }
        
        return true;
    },
    
    podeAcessarComoInquilino: () => {
        const usuario = Auth.getUsuario();
        if (!usuario) return false;
        
        const isProprietario = usuario.isProprietario === true || usuario.proprietario === true;
        const isInquilino = usuario.isInquilino === true || usuario.inquilino === true;
        
        if (!isInquilino) return false;
        
        const perfilAtivo = Auth.getPerfilAtivo();
        if (isProprietario && isInquilino) {
            return perfilAtivo === 'INQUILINO';
        }
        
        return true;
    },
    
    isProprietario: () => {
        const usuario = Auth.getUsuario();
        if (!usuario) return false;
        return usuario.isProprietario === true || usuario.tipoUsuario === 'PROPRIETARIO' || usuario.tipoUsuario === 'AMBOS';
    },
    
    isInquilino: () => {
        const usuario = Auth.getUsuario();
        if (!usuario) return false;
        return usuario.isInquilino === true || usuario.tipoUsuario === 'INQUILINO' || usuario.tipoUsuario === 'AMBOS';
    }
};
