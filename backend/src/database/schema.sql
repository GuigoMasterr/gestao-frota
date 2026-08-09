-- Tabela de Usuários
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nivel VARCHAR(20) NOT NULL CHECK (nivel IN ('adm', 'supervisor', 'motorista', 'visitante')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Veículos
CREATE TABLE veiculos (
  id SERIAL PRIMARY KEY,
  placa VARCHAR(10) UNIQUE NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('carro', 'van', 'caminhão', 'betoneira', 'munck', 'carreta', 'guindaste')),
  km_atual INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vinculo Motorista ↔ Veículo
CREATE TABLE motorista_veiculo (
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, veiculo_id)
);

-- Tabela de Checklists
CREATE TABLE checklists (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE NOT NULL,
  km_registrado INTEGER NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  fotos JSONB NOT NULL,
  itens JSONB NOT NULL,
  -- Campos específicos de cintas
  cinta_2m INTEGER,
  cinta_3m INTEGER,
  cinta_4m INTEGER,
  cinta_6m INTEGER,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Chamados
CREATE TABLE chamados (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  veiculo_id INTEGER REFERENCES veiculos(id) ON DELETE CASCADE NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'aberto',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usuário ADM padrão (senha: admin123 — altere depois!)
INSERT INTO usuarios (nome, email, senha, nivel) VALUES 
('Administrador', 'admin@frota.com', '$2a$10$K2z4sUrJ5vHhU2aRzqgX/.x9p5CnRzF1wQ7vH5uJ3aX7z9vH7x5aG', 'adm');