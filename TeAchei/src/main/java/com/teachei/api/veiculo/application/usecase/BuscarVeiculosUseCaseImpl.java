package com.teachei.api.veiculo.application.usecase;

import com.teachei.api.veiculo.application.ports.in.BuscarVeiculosUseCase;
import com.teachei.api.veiculo.application.ports.out.VeiculoDataPort;
import com.teachei.api.shared.domain.model.TipoVeiculo;

import java.util.List;

/**
 * Implementation of the vehicle data search use case.
 */
public class BuscarVeiculosUseCaseImpl implements BuscarVeiculosUseCase {

    private final VeiculoDataPort veiculoDataPort;

    public BuscarVeiculosUseCaseImpl(VeiculoDataPort veiculoDataPort) {
        this.veiculoDataPort = veiculoDataPort;
    }

    @Override
    public List<MarcaDTO> buscarMarcas(TipoVeiculo tipo) {
        return veiculoDataPort.getMarcas(tipo).stream()
            .map(m -> new MarcaDTO(m.codigo(), m.nome()))
            .toList();
    }

    @Override
    public List<ModeloDTO> buscarModelos(TipoVeiculo tipo, String marcaCodigo) {
        return veiculoDataPort.getModelos(tipo, marcaCodigo).stream()
            .map(m -> new ModeloDTO(m.codigo(), m.nome()))
            .toList();
    }

    @Override
    public List<AnoDTO> buscarAnos(TipoVeiculo tipo, String marcaCodigo, String modeloCodigo) {
        return veiculoDataPort.getAnos(tipo, marcaCodigo, modeloCodigo).stream()
            .map(a -> new AnoDTO(a.codigo(), a.nome()))
            .toList();
    }

    @Override
    public PrecoFipeDTO buscarPreco(TipoVeiculo tipo, String marcaCodigo, 
                                     String modeloCodigo, String anoCodigo) {
        VeiculoDataPort.PrecoFipe preco = veiculoDataPort.getPrecoFipe(
            tipo, marcaCodigo, modeloCodigo, anoCodigo);
        
        return new PrecoFipeDTO(
            preco.valor(),
            preco.marca(),
            preco.modelo(),
            preco.anoModelo(),
            preco.combustivel(),
            preco.codigoFipe(),
            preco.mesReferencia()
        );
    }
}



