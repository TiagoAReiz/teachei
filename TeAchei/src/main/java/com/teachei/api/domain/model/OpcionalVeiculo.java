package com.teachei.api.domain.model;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Optional vehicle features that buyers can specify in their intentions.
 * Each optional is associated with one or more vehicle types.
 */
public enum OpcionalVeiculo {
    // === UNIVERSAIS (todos os tipos) ===
    ABS("Freios ABS", TipoVeiculo.CARRO, TipoVeiculo.MOTO, TipoVeiculo.CAMINHAO),
    ALARME("Alarme", TipoVeiculo.CARRO, TipoVeiculo.MOTO, TipoVeiculo.CAMINHAO),

    // === CARRO + CAMINHÃO ===
    AR_CONDICIONADO("Ar Condicionado", TipoVeiculo.CARRO, TipoVeiculo.CAMINHAO),
    DIRECAO_HIDRAULICA("Direção Hidráulica", TipoVeiculo.CARRO, TipoVeiculo.CAMINHAO),
    DIRECAO_ELETRICA("Direção Elétrica", TipoVeiculo.CARRO, TipoVeiculo.CAMINHAO),
    CAMERA_RE("Câmera de Ré", TipoVeiculo.CARRO, TipoVeiculo.CAMINHAO),
    MULTIMIDIA("Central Multimídia", TipoVeiculo.CARRO, TipoVeiculo.CAMINHAO),
    BLUETOOTH("Bluetooth", TipoVeiculo.CARRO, TipoVeiculo.CAMINHAO),

    // === EXCLUSIVOS CARRO ===
    VIDRO_ELETRICO("Vidro Elétrico", TipoVeiculo.CARRO),
    TETO_SOLAR("Teto Solar", TipoVeiculo.CARRO),
    BANCOS_COURO("Bancos de Couro", TipoVeiculo.CARRO),
    SENSOR_ESTACIONAMENTO("Sensor de Estacionamento", TipoVeiculo.CARRO),
    AIRBAG("Airbag", TipoVeiculo.CARRO),
    RODAS_LIGA("Rodas de Liga", TipoVeiculo.CARRO),
    PILOTO_AUTOMATICO("Piloto Automático", TipoVeiculo.CARRO),

    // === EXCLUSIVOS MOTO ===
    PARTIDA_ELETRICA("Partida Elétrica", TipoVeiculo.MOTO),
    INJECAO_ELETRONICA("Injeção Eletrônica", TipoVeiculo.MOTO),
    FREIO_DISCO_DIANTEIRO("Freio a Disco Dianteiro", TipoVeiculo.MOTO),
    FREIO_DISCO_TRASEIRO("Freio a Disco Traseiro", TipoVeiculo.MOTO),
    CBS("Freio Combinado CBS", TipoVeiculo.MOTO),
    CONTROLE_TRACAO("Controle de Tração", TipoVeiculo.MOTO),
    PAINEL_DIGITAL("Painel Digital", TipoVeiculo.MOTO),
    FAROL_LED("Farol LED", TipoVeiculo.MOTO),
    PORTA_USB("Porta USB", TipoVeiculo.MOTO),
    BAU_TRASEIRO("Baú Traseiro", TipoVeiculo.MOTO),
    PROTETOR_MOTOR("Protetor de Motor", TipoVeiculo.MOTO),
    SLIDER("Slider de Proteção", TipoVeiculo.MOTO),
    BAGAGEIRO("Bagageiro", TipoVeiculo.MOTO),
    PARABRISA("Para-brisa", TipoVeiculo.MOTO),
    QUICKSHIFTER("Quick Shifter", TipoVeiculo.MOTO),
    MODOS_PILOTAGEM("Modos de Pilotagem", TipoVeiculo.MOTO),
    GPS_NAVEGACAO("GPS/Navegação", TipoVeiculo.MOTO),

    // === EXCLUSIVOS CAMINHÃO ===
    DIRECAO_ELETROHIDRAULICA("Direção Eletro-hidráulica", TipoVeiculo.CAMINHAO),
    ASR("Controle de Aderência (ASR)", TipoVeiculo.CAMINHAO),
    ESC("Controle de Estabilidade (ESC)", TipoVeiculo.CAMINHAO),
    SUSPENSAO_PNEUMATICA("Suspensão Pneumática", TipoVeiculo.CAMINHAO),
    CABINE_LEITO("Cabine Leito", TipoVeiculo.CAMINHAO),
    TOMADA_FORCA("Tomada de Força (PTO)", TipoVeiculo.CAMINHAO),
    BLOQUEIO_DIFERENCIAL("Bloqueio de Diferencial", TipoVeiculo.CAMINHAO),
    RETARDER("Freio Retarder", TipoVeiculo.CAMINHAO),
    TACOGRAFO_DIGITAL("Tacógrafo Digital", TipoVeiculo.CAMINHAO),
    SENSOR_FADIGA("Sensor de Fadiga", TipoVeiculo.CAMINHAO),
    RASTREADOR("GPS/Rastreador", TipoVeiculo.CAMINHAO),
    AR_CONDICIONADO_TETO("Ar Condicionado de Teto", TipoVeiculo.CAMINHAO);

    private final String label;
    private final Set<TipoVeiculo> tiposAplicaveis;

    OpcionalVeiculo(String label, TipoVeiculo... tipos) {
        this.label = label; 
        this.tiposAplicaveis = tipos.length > 0 
            ? EnumSet.copyOf(Arrays.asList(tipos))
            : EnumSet.noneOf(TipoVeiculo.class);
    }

    public String getLabel() {
        return label;
    }

    /**
     * Returns the vehicle types this optional applies to.
     */
    public Set<TipoVeiculo> getTiposAplicaveis() {
        return tiposAplicaveis;
    }

    /**
     * Checks if this optional is applicable to the given vehicle type.
     */
    public boolean isAplicavelPara(TipoVeiculo tipo) {
        return tipo != null && tiposAplicaveis.contains(tipo);
    }

    /**
     * Returns all optionals applicable to the given vehicle type.
     * 
     * @param tipo the vehicle type to filter by
     * @return list of optionals applicable to the type
     */
    public static List<OpcionalVeiculo> getOpcionaisPorTipo(TipoVeiculo tipo) {
        if (tipo == null) {
            return List.of();
        }
        return Arrays.stream(values())
            .filter(op -> op.isAplicavelPara(tipo))
            .collect(Collectors.toList());
    }

    /**
     * Validates if all provided optionals are compatible with the vehicle type.
     * 
     * @param opcionais the optionals to validate
     * @param tipo the vehicle type
     * @return list of incompatible optionals (empty if all valid)
     */
    public static List<OpcionalVeiculo> getOpcionaisIncompativeis(List<OpcionalVeiculo> opcionais, TipoVeiculo tipo) {
        if (opcionais == null || tipo == null) {
            return List.of();
        }
        return opcionais.stream()
            .filter(op -> !op.isAplicavelPara(tipo))
            .collect(Collectors.toList());
    }
}
