-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 21/11/2024 às 02:21
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
(1, 'Administrador', 'admin@email.com', '1234', '2024-11-05 00:00:00');

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
  `data_cadastro` datetime DEFAULT NULL,
  `curriculo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `candidato`
--

INSERT INTO `candidato` (`id_candidato`, `nome`, `data_nasc`, `cpf`, `email`, `telefone`, `senha`, `data_cadastro`, `curriculo`) VALUES
(1, 'Candidato1', '2024-11-01', '244.244.343-01', 'candidato1@gmail.com', '(11) 93031-5532', '1234', '2024-11-05 19:09:58', NULL);

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

--
-- Despejando dados para a tabela `candidatura`
--

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
(1, 'Empresa1', '13.122.122/122', '(11) 93069-8014', 'empresa@email.com', '1234', '2024-11-07 17:51:09');

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
-- Estrutura para tabela `vaga`
--

CREATE TABLE `vaga` (
  `id_vaga` int(11) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `data_publicacao` datetime DEFAULT NULL,
  `data_fechamento` datetime DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vaga`
--
INSERT INTO `vaga` (`id_vaga`, `titulo`, `cidade`, `descricao`, `data_publicacao`, `data_fechamento`, `estado`, `id_empresa`, `categoria`) VALUES
(1, 'Analista de Marketing', 'Rio de Janeiro', 'Planejar e executar campanhas de marketing digital.', '2024-11-02 09:30:00', '2024-12-02 17:00:00', 'RJ', 1, 'Marketing'),
(2, 'Contador', 'Belo Horizonte', 'Gerenciar contas e realizar auditorias financeiras.', '2024-11-03 11:00:00', '2024-12-03 18:00:00', 'MG', 1, 'Finanças'),
(3, 'Designer Gráfico', 'Curitiba', 'Criar materiais gráficos para campanhas publicitárias.', '2024-11-04 08:00:00', '2024-12-04 17:00:00', 'PR', 1, 'Design'),
(4, 'Professor de Inglês', 'Porto Alegre', 'Ensinar inglês para alunos de nível intermediário.', '2024-11-05 10:00:00', '2024-12-05 18:00:00', 'RS', 1, 'Educação'),
(5, 'Músico Freelancer', 'Brasília', 'Participar de eventos e gravações.', '2024-11-06 10:00:00', '2024-12-06 18:00:00', 'DF', 1, 'Música');

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
-- Índices de tabela `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `cnpj` (`cnpj`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `inscreve`
--
ALTER TABLE `inscreve`
  ADD PRIMARY KEY (`id_candidatura`,`id_candidato`),
  ADD KEY `id_candidato` (`id_candidato`);

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
  MODIFY `id_administrador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `candidato`
--
ALTER TABLE `candidato`
  MODIFY `id_candidato` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `candidatura`
--
ALTER TABLE `candidatura`
  MODIFY `id_candidatura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `vaga`
--
ALTER TABLE `vaga`
  MODIFY `id_vaga` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `candidatura`
--
ALTER TABLE `candidatura`
  ADD CONSTRAINT `candidatura_ibfk_1` FOREIGN KEY (`id_vaga`) REFERENCES `vaga` (`id_vaga`);

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
