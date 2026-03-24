-- V1: Baseline schema - todas as 4 tabelas PostgreSQL
-- Em prod: tabelas já existem, IF NOT EXISTS garante que é no-op
-- Em DB novo: cria tudo do zero

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL,
    criado_em TIMESTAMP(6) NOT NULL,
    atualizado_em TIMESTAMP(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS perfis (
    id UUID PRIMARY KEY,
    usuario_id UUID NOT NULL UNIQUE,
    nome VARCHAR(255),
    bio VARCHAR(500),
    role VARCHAR(255),
    whatsapp VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(255),
    avaliacao_media DOUBLE PRECISION NOT NULL,
    total_avaliacoes INTEGER NOT NULL,
    criado_em TIMESTAMP(6) NOT NULL,
    atualizado_em TIMESTAMP(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS assinaturas (
    id UUID PRIMARY KEY,
    usuario_id UUID NOT NULL,
    plano VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    data_inicio TIMESTAMP(6),
    data_fim TIMESTAMP(6),
    transacao_id VARCHAR(255),
    criado_em TIMESTAMP(6) NOT NULL,
    atualizado_em TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS transacoes_pagamento (
    id UUID PRIMARY KEY,
    payment_id BIGINT UNIQUE,
    usuario_id UUID NOT NULL,
    anuncio_id VARCHAR(255) NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    metodo_pagamento VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP(6) NOT NULL,
    atualizado_em TIMESTAMP(6) NOT NULL
);
