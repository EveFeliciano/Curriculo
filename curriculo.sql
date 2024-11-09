-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/11/2024 às 04:05
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `curriculo`
--
CREATE DATABASE IF NOT EXISTS `curriculo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `curriculo`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `administrador`
--

CREATE TABLE `administrador` (
  `id_administrador` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(10) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `administrador`
--

INSERT INTO `administrador` (`id_administrador`, `nome`, `email`, `senha`, `data_cadastro`) VALUES
(1, 'Evellyn de Santana', 'evellyn@email.com', 'eve123', NULL),
(2, 'Gabriel Caspirro', 'gabriel@email.com', 'gab123', NULL),
(3, 'Guilherme Augusto', 'guilhermea@email.com', 'guia123', NULL),
(4, 'Guilherme Nakamura', 'guilhermen@email.com', 'guin123', NULL),
(5, 'Raquel Araujo', 'raquela@email.com', 'raq123', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `candidato`
--

CREATE TABLE `candidato` (
  `id_candidato` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `data_nasc` date DEFAULT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(15) DEFAULT NULL,
  `senha` varchar(10) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `candidato`
--

INSERT INTO `candidato` (`id_candidato`, `nome`, `data_nasc`, `cpf`, `email`, `telefone`, `senha`, `data_cadastro`) VALUES
(1, 'João Silva', '1990-05-15', '123.456.789', 'joao.silva@email.com', '(11) 91234-5678', 'senha123', NULL),
(2, 'Maria Oliveira', '1985-11-22', '987.654.321', 'maria.oliveira@email.com', '(21) 99876-5432', 'senha456', NULL),
(3, 'Carlos Souza', '1992-02-10', '111.222.333', 'carlos.souza@email.com', '(31) 93333-4444', 'senha789', NULL),
(4, 'Ana Costa', '1988-07-30', '555.666.777', 'ana.costa@email.com', '(41) 94444-5555', 'senha10111', NULL),
(5, 'Lucas Pereira', '1995-12-05', '333.444.555', 'lucas.pereira@email.com', '(61) 95555-6666', 'senha13141', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `candidatura`
--

CREATE TABLE `candidatura` (
  `id_candidatura` int(11) NOT NULL,
  `data_candidatura` datetime DEFAULT NULL,
  `status` enum('em espera','reprovado','aprovado') DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `id_vaga` int(11) DEFAULT NULL,
  `curriculo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cand_qualidades`
--

CREATE TABLE `cand_qualidades` (
  `id_cand_qualidades` int(11) NOT NULL,
  `outro` varchar(100) DEFAULT NULL,
  `id_candidatura` int(11) DEFAULT NULL,
  `id_qualidades` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresa`
--

CREATE TABLE `empresa` (
  `id_empresa` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `cnpj` varchar(14) DEFAULT NULL,
  `telefone` varchar(15) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(10) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `empresa`
--

INSERT INTO `empresa` (`id_empresa`, `nome`, `cnpj`, `telefone`, `email`, `senha`, `data_cadastro`) VALUES
(1, 'Tech Solutions Ltda.', '12.345.678/000', '(11) 3000-4000', 'contato@techsolutions.com.br', 'empresa123', NULL),
(2, 'Global Comercio S.A.', '98.765.432/000', '(21) 4000-5000', 'sac@globalcomercio.com.br', 'global456', NULL),
(3, 'ConstruMax Engenharia', '23.456.789/000', '(31) 5000-6000', 'atendimento@construmax.com.br', 'max789', NULL),
(4, 'Logística Rápida Ltda.', '34.567.890/000', '(41) 6000-7000', 'logistica@rapida.com.br', 'logistica1', NULL),
(5, 'Alimentos Naturais S.A.', '45.678.901/000', '(51) 7000-8000', 'contato@alimentosnaturais.com.br', 'alimentos2', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `entrevista`
--

CREATE TABLE `entrevista` (
  `id_entrevista` int(11) NOT NULL,
  `data_entrevista` datetime DEFAULT NULL,
  `tipo` enum('virtual','presencial') DEFAULT NULL,
  `localizacao` varchar(100) DEFAULT NULL,
  `id_candidatura` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `inscreve`
--

CREATE TABLE `inscreve` (
  `id_candidatura` int(11) NOT NULL,
  `id_candidato` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `qualidades`
--

CREATE TABLE `qualidades` (
  `id_qualidades` int(11) NOT NULL,
  `descricao` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `vaga`
--

CREATE TABLE `vaga` (
  `id_vaga` int(11) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `categorias` varchar(100) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `data_publicacao` datetime DEFAULT NULL,
  `data_fechamento` datetime DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vaga`
--

INSERT INTO `vaga` (`id_vaga`, `titulo`, `cidade`, `estado`, `categorias`, `descricao`, `data_publicacao`, `data_fechamento`, `id_empresa`) VALUES
(1, 'Desenvolvedor Backend', 'São Paulo', 'SP', 'Tecnologia', 'Responsável pelo desenvolvimento de soluções backend em sistemas web.', '2024-11-01 00:00:00', '2024-11-30 00:00:00', 1),
(2, 'Analista de Marketing Digital', 'Rio de Janeiro', 'RJ', 'Marketing', 'Atuação na criação e gestão de campanhas de marketing digital.', '2024-10-25 00:00:00', '2024-11-20 00:00:00', 2),
(3, 'Engenheiro Civil', 'Belo Horizonte', 'MG', 'Engenharia', 'Responsável por projetos de construção e supervisão de obras.', '2024-11-05 00:00:00', '2024-12-05 00:00:00', 3),
(4, 'Motorista de Caminhão', 'Curitiba', 'PR', 'Logística', 'Realização de transporte de cargas com caminhão de grande porte.', '2024-11-10 00:00:00', '2024-12-10 00:00:00', 4),
(5, 'Assistente de RH', 'Porto Alegre', 'RS', 'Recursos Humanos', 'Auxiliar nas atividades de recrutamento, seleção e administração de pessoal.', '2024-11-15 00:00:00', '2024-12-15 00:00:00', 5);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id_administrador`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `candidato`
--
ALTER TABLE `candidato`
  ADD PRIMARY KEY (`id_candidato`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `candidatura`
--
ALTER TABLE `candidatura`
  ADD PRIMARY KEY (`id_candidatura`),
  ADD KEY `id_vaga` (`id_vaga`);

--
-- Índices de tabela `cand_qualidades`
--
ALTER TABLE `cand_qualidades`
  ADD PRIMARY KEY (`id_cand_qualidades`),
  ADD KEY `id_candidatura` (`id_candidatura`),
  ADD KEY `id_qualidades` (`id_qualidades`);

--
-- Índices de tabela `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `cnpj` (`cnpj`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `entrevista`
--
ALTER TABLE `entrevista`
  ADD PRIMARY KEY (`id_entrevista`),
  ADD KEY `id_candidatura` (`id_candidatura`);

--
-- Índices de tabela `inscreve`
--
ALTER TABLE `inscreve`
  ADD PRIMARY KEY (`id_candidatura`,`id_candidato`),
  ADD KEY `id_candidato` (`id_candidato`);

--
-- Índices de tabela `qualidades`
--
ALTER TABLE `qualidades`
  ADD PRIMARY KEY (`id_qualidades`);

--
-- Índices de tabela `vaga`
--
ALTER TABLE `vaga`
  ADD PRIMARY KEY (`id_vaga`),
  ADD KEY `id_empresa` (`id_empresa`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id_administrador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `candidato`
--
ALTER TABLE `candidato`
  MODIFY `id_candidato` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `candidatura`
--
ALTER TABLE `candidatura`
  MODIFY `id_candidatura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cand_qualidades`
--
ALTER TABLE `cand_qualidades`
  MODIFY `id_cand_qualidades` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `entrevista`
--
ALTER TABLE `entrevista`
  MODIFY `id_entrevista` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `qualidades`
--
ALTER TABLE `qualidades`
  MODIFY `id_qualidades` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `vaga`
--
ALTER TABLE `vaga`
  MODIFY `id_vaga` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `candidatura`
--
ALTER TABLE `candidatura`
  ADD CONSTRAINT `candidatura_ibfk_1` FOREIGN KEY (`id_vaga`) REFERENCES `vaga` (`id_vaga`);

--
-- Restrições para tabelas `cand_qualidades`
--
ALTER TABLE `cand_qualidades`
  ADD CONSTRAINT `cand_qualidades_ibfk_1` FOREIGN KEY (`id_candidatura`) REFERENCES `candidatura` (`id_candidatura`),
  ADD CONSTRAINT `cand_qualidades_ibfk_2` FOREIGN KEY (`id_qualidades`) REFERENCES `qualidades` (`id_qualidades`);

--
-- Restrições para tabelas `entrevista`
--
ALTER TABLE `entrevista`
  ADD CONSTRAINT `entrevista_ibfk_1` FOREIGN KEY (`id_candidatura`) REFERENCES `candidatura` (`id_candidatura`);

--
-- Restrições para tabelas `inscreve`
--
ALTER TABLE `inscreve`
  ADD CONSTRAINT `inscreve_ibfk_1` FOREIGN KEY (`id_candidatura`) REFERENCES `candidatura` (`id_candidatura`),
  ADD CONSTRAINT `inscreve_ibfk_2` FOREIGN KEY (`id_candidato`) REFERENCES `candidato` (`id_candidato`);

--
-- Restrições para tabelas `vaga`
--
ALTER TABLE `vaga`
  ADD CONSTRAINT `vaga_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
