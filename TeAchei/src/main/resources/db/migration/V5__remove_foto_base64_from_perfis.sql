-- Remove foto_base64 column from perfis table
-- Profile photos are now stored exclusively in Azure Blob Storage (foto_url column)
ALTER TABLE perfis DROP COLUMN IF EXISTS foto_base64;
