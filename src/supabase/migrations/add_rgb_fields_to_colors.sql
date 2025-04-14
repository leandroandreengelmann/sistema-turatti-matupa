-- Adicionar campos RGB e NCS à tabela colors
ALTER TABLE colors ADD COLUMN IF NOT EXISTS rgb TEXT;
ALTER TABLE colors ADD COLUMN IF NOT EXISTS red INTEGER;
ALTER TABLE colors ADD COLUMN IF NOT EXISTS green INTEGER;
ALTER TABLE colors ADD COLUMN IF NOT EXISTS blue INTEGER;
ALTER TABLE colors ADD COLUMN IF NOT EXISTS ncs TEXT;
ALTER TABLE colors ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Atualizar campos collectionId para collectionid se necessário
-- Isso resolve o problema de compatibilidade de maiúsculas/minúsculas
ALTER TABLE colors RENAME COLUMN IF EXISTS "collectionId" TO collectionid;
ALTER TABLE colors RENAME COLUMN IF EXISTS "hexCode" TO hexcode; 