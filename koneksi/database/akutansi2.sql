-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2023 at 03:59 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `akutansi2`
--

-- --------------------------------------------------------

--
-- Table structure for table `bagihasils`
--

CREATE TABLE `bagihasils` (
  `id` int(11) NOT NULL,
  `presentase_koperasi` int(11) NOT NULL,
  `presentase_anggota` int(11) NOT NULL,
  `vee_admin` int(11) NOT NULL,
  `periode` int(11) NOT NULL,
  `amount_koperasi` int(11) NOT NULL,
  `amount_admin` int(11) NOT NULL,
  `amount_angota` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jenissimpanans`
--

CREATE TABLE `jenissimpanans` (
  `id` int(11) NOT NULL,
  `jenis_simpanan` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `amount` int(11) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` int(11) NOT NULL,
  `id_transaksi` int(11) NOT NULL,
  `angsuran_ke` varchar(100) NOT NULL,
  `jumlah_angsuran_bulan` text NOT NULL,
  `sisa_angsuran` int(11) NOT NULL,
  `status` varchar(100) NOT NULL,
  `foto` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pinjamans`
--

CREATE TABLE `pinjamans` (
  `id` int(11) NOT NULL,
  `jenis_pinjaman` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `maksimal_pinjaman` int(11) NOT NULL,
  `lama_angsuran` int(11) NOT NULL,
  `bunga` int(11) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_pinjamans`
--

CREATE TABLE `transaksi_pinjamans` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `jenis_pinjaman` varchar(100) NOT NULL,
  `tanggal_pengajuan` date NOT NULL,
  `tanggal_pencairan` date DEFAULT NULL,
  `created_by` varchar(100) NOT NULL,
  `approved_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(200) NOT NULL,
  `jumlah_pinjaman` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `bunga` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_simpanans`
--

CREATE TABLE `transaksi_simpanans` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `jenis_simpan` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `besar_simpanan` int(11) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(200) NOT NULL,
  `nik` int(11) DEFAULT NULL,
  `nip` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `nik`, `nip`, `name`, `alamat`, `status`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$EJCRXtyxffDT/rs5iK3sW.W2iiF7qw68NITX1l3tEHoUzj.lBPgOS', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(2, 'admin', 'admin2@gmail.com', '$2b$10$29tMOhLzZX84SXsDWRhW5Ok9FQTdNfg/sjwxwX1ld/h8NPMxRBRRG', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(3, 'admin', 'admin3@gmail.com', '$2b$10$LAqyNFggvuOnNHTGSdsv9.w4p1fQ8EncWJJ2rX/UQ8Eb1DbnArPVe', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(4, 'admin', 'admin4@gmail.com', '$2b$10$1L8V1ka54c4PMtySs20A4ecLqgcaMkc4Mk9EB4mJr4o.e2wkfpAR6', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(5, 'admin', 'admin5@gmail.com', '$2b$10$.nE6v7m2Xyz87JUY/kolj.nTPR23w9at1QXsb16RXbCeumNEUE2xC', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bagihasils`
--
ALTER TABLE `bagihasils`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jenissimpanans`
--
ALTER TABLE `jenissimpanans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pinjamans`
--
ALTER TABLE `pinjamans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksi_pinjamans`
--
ALTER TABLE `transaksi_pinjamans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksi_simpanans`
--
ALTER TABLE `transaksi_simpanans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bagihasils`
--
ALTER TABLE `bagihasils`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenissimpanans`
--
ALTER TABLE `jenissimpanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pinjamans`
--
ALTER TABLE `pinjamans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi_pinjamans`
--
ALTER TABLE `transaksi_pinjamans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi_simpanans`
--
ALTER TABLE `transaksi_simpanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
