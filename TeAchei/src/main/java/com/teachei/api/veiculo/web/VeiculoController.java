package com.teachei.api.veiculo.web;

import com.teachei.api.veiculo.web.dto.response.VeiculoDataResponse.*;
import com.teachei.api.veiculo.application.ports.in.BuscarVeiculosUseCase;
import com.teachei.api.shared.domain.model.TipoVeiculo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/veiculos")
public class VeiculoController {

    private final BuscarVeiculosUseCase buscarVeiculosUseCase;

    public VeiculoController(BuscarVeiculosUseCase buscarVeiculosUseCase) {
        this.buscarVeiculosUseCase = buscarVeiculosUseCase;
    }

    @GetMapping("/{tipo}/marcas")
    public ResponseEntity<MarcasResponse> buscarMarcas(@PathVariable TipoVeiculo tipo) {
        var marcas = buscarVeiculosUseCase.buscarMarcas(tipo);
        var items = marcas.stream()
            .map(m -> new MarcaItem(m.codigo(), m.nome()))
            .toList();
        return ResponseEntity.ok(new MarcasResponse(items));
    }

    @GetMapping("/{tipo}/marcas/{marcaCodigo}/modelos")
    public ResponseEntity<ModelosResponse> buscarModelos(
            @PathVariable TipoVeiculo tipo,
            @PathVariable String marcaCodigo) {
        var modelos = buscarVeiculosUseCase.buscarModelos(tipo, marcaCodigo);
        var items = modelos.stream()
            .map(m -> new ModeloItem(m.codigo(), m.nome()))
            .toList();
        return ResponseEntity.ok(new ModelosResponse(items));
    }

    @GetMapping("/{tipo}/marcas/{marcaCodigo}/modelos/{modeloCodigo}/anos")
    public ResponseEntity<AnosResponse> buscarAnos(
            @PathVariable TipoVeiculo tipo,
            @PathVariable String marcaCodigo,
            @PathVariable String modeloCodigo) {
        var anos = buscarVeiculosUseCase.buscarAnos(tipo, marcaCodigo, modeloCodigo);
        var items = anos.stream()
            .map(a -> new AnoItem(a.codigo(), a.nome()))
            .toList();
        return ResponseEntity.ok(new AnosResponse(items));
    }

    @GetMapping("/{tipo}/marcas/{marcaCodigo}/modelos/{modeloCodigo}/anos/{anoCodigo}/preco")
    public ResponseEntity<PrecoFipeResponse> buscarPreco(
            @PathVariable TipoVeiculo tipo,
            @PathVariable String marcaCodigo,
            @PathVariable String modeloCodigo,
            @PathVariable String anoCodigo) {
        var preco = buscarVeiculosUseCase.buscarPreco(tipo, marcaCodigo, modeloCodigo, anoCodigo);
        return ResponseEntity.ok(new PrecoFipeResponse(
            preco.valor(),
            preco.marca(),
            preco.modelo(),
            preco.anoModelo(),
            preco.combustivel(),
            preco.codigoFipe(),
            preco.mesReferencia()
        ));
    }
}



