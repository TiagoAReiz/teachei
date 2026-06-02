package com.teachei.api.shared.security;

import com.teachei.api.usuario.application.ports.out.UsuarioRepositoryPort;
import com.teachei.api.usuario.domain.model.Usuario;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepositoryPort usuarioRepository;

    public CustomUserDetailsService(UsuarioRepositoryPort usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.buscarPorEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        return new CurrentUser(
            usuario.getId(),
            usuario.getEmail(),
            usuario.getSenha(),
            usuario.isAtivo()
        );
    }

    public UserDetails loadUserById(UUID id) {
        Usuario usuario = usuarioRepository.buscarPorId(id)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + id));

        return new CurrentUser(
            usuario.getId(),
            usuario.getEmail(),
            usuario.getSenha(),
            usuario.isAtivo()
        );
    }
}



