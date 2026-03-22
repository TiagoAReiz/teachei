-- Add terms acceptance tracking columns to usuarios table
ALTER TABLE usuarios ADD COLUMN aceitou_termos BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE usuarios ADD COLUMN aceitou_termos_em TIMESTAMP;

-- Mark existing users as having accepted terms (grandfathered in)
UPDATE usuarios SET aceitou_termos = true, aceitou_termos_em = criado_em;
