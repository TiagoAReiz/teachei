package com.teachei.api.veiculo.config;

import com.teachei.api.veiculo.application.ports.in.BuscarVeiculosUseCase;
import com.teachei.api.veiculo.application.ports.out.VeiculoDataPort;
import com.teachei.api.veiculo.application.usecase.BuscarVeiculosUseCaseImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VeiculoBeans {

    @Bean
    public BuscarVeiculosUseCase buscarVeiculosUseCase(VeiculoDataPort veiculoDataPort) {
        return new BuscarVeiculosUseCaseImpl(veiculoDataPort);
    }
}
