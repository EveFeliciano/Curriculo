-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 25/11/2024 às 04:48
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
(1, 'ADM01', 'adm@email.com', '1234', '2024-11-25 00:00:00');

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
  `senha` varchar(60) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT NULL,
  `curriculo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `candidato`
--

INSERT INTO `candidato` (`id_candidato`, `nome`, `data_nasc`, `cpf`, `email`, `telefone`, `senha`, `data_cadastro`, `curriculo`) VALUES
(16, 'Cand', '2001-01-01', '123.456.789', 'cand@email.com', '(11) 12345-6789', '$2b$10$2POZAd20zSvraeagGAaVT.0C0CY1FYt8uIF0EpPX3s70731z/xv2O', '2024-11-25 00:47:36', NULL);

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
  `curriculo` text DEFAULT NULL,
  `motivo` text DEFAULT NULL
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
  `senha` varchar(255) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `empresa`
--

INSERT INTO `empresa` (`id_empresa`, `nome`, `cnpj`, `telefone`, `email`, `senha`, `data_cadastro`) VALUES
(6, 'Empresa 01', '12.345.678/000', '(11) 98765-4321', 'emp@email.com', '$2b$10$TWrcgJ2rTYKmx./kReZEJuufXWnbh0yRfAMH9WZT2DUfNSNKZg7fG', '2024-11-25 00:16:54');

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
(17, 'Web Designer', 'Ribeirão Pires', 'Estamos em busca de um Web Designer criativo e experiente em design de interfaces digitais. O candidato ideal deve ter habilidades em design responsivo e domínio das principais ferramentas como Adobe XD, Figma e Sketch.', '2024-11-25 00:18:29', '2024-11-30 00:00:00', 'SP', 6, 'design'),
(18, 'Marketing Digital', 'Belo Horizonte', 'Estamos em busca de um Analista de Marketing Digital criativo e analítico para integrar nossa equipe. O candidato ideal deve ter experiência em estratégias digitais, incluindo SEO, SEM, redes sociais, e-mail marketing e análise de dados.', '2024-11-25 00:23:25', '2024-11-30 00:00:00', 'MG', 6, 'marketing'),
(19, 'Contador', 'Santo André', 'Estamos em busca de um Contador responsável, detalhista e com sólida experiência na área contábil para integrar nossa equipe. O candidato ideal deve ter conhecimento em legislação fiscal, contabilidade geral, análise de balanços, e elaboração de relatórios financeiros.', '2024-11-25 00:24:23', '2024-11-30 00:00:00', 'SP', 6, 'finanças'),
(20, 'Produtor Musical', 'Rio de Janeiro', 'Estamos em busca de um Produtor Musical criativo, experiente e apaixonado por música para integrar nossa equipe. O candidato ideal deve ter habilidades em gravação, edição, mixagem e masterização de áudio, além de um bom conhecimento das tendências musicais e da indústria fonográfica.', '2024-11-25 00:25:19', '2024-11-30 00:00:00', 'RJ', 6, 'música'),
(21, 'Professor de Matemática', 'Salvador', 'Estamos em busca de um Professor de Matemática comprometido, didático e apaixonado pelo ensino para integrar nossa equipe. O candidato ideal deve ter sólida formação acadêmica em Matemática, ser capaz de transmitir conceitos de forma clara e engajante e adaptar métodos de ensino às necessidades dos alunos.', '2024-11-25 00:26:58', '2024-11-30 00:00:00', 'BA', 6, 'educação');

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
  MODIFY `id_administrador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `candidato`
--
ALTER TABLE `candidato`
  MODIFY `id_candidato` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `candidatura`
--
ALTER TABLE `candidatura`
  MODIFY `id_candidatura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `vaga`
--
ALTER TABLE `vaga`
  MODIFY `id_vaga` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
