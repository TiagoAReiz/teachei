-- Add foto_url column to perfis table for Blob Storage URLs
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_perfis_foto_url ON perfis(foto_url) WHERE foto_url IS NOT NULL;

COMMENT ON COLUMN perfis.foto_url IS 'URL of profile photo in Azure Blob Storage';
