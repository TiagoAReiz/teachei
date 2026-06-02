package com.teachei.api.application.usecase;

import com.teachei.api.application.ports.in.AlterarSenhaUseCase;
import com.teachei.api.shared.security.PasswordEncoderPort;
import com.teachei.api.application.ports.out.UsuarioRepositoryPort;
import com.teachei.api.domain.exception.CredenciaisInvalidasException;
import com.teachei.api.domain.exception.UsuarioNaoEncontradoException;
import com.teachei.api.domain.model.Usuario;

import java.util.UUID;

/**
 * Implementation of the password change use case.
 */
public class AlterarSenhaUseCaseImpl implements AlterarSenhaUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoderPort passwordEncoder;

    public AlterarSenhaUseCaseImpl(UsuarioRepositoryPort usuarioRepository,
                                    PasswordEncoderPort passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void executar(UUID usuarioId, AlterarSenhaCommand command) {
        // Find user
        Usuario usuario = usuarioRepository.buscarPorId(usuarioId)
            .orElseThrow(() -> new UsuarioNaoEncontradoException(usuarioId));

        // Verify current password
        if (!passwordEncoder.matches(command.senhaAtual(), usuario.getSenha())) {
            throw new CredenciaisInvalidasException("Senha atual incorreta");
        }

        // Encode new password
        String novaSenhaHash = passwordEncoder.encode(command.novaSenha());

        // Update password
        usuario.alterarSenha(novaSenhaHash);

        // Save
        usuarioRepository.salvar(usuario);
    }
}
