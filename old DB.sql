-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 12 Sep 2023 pada 05.59
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

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
-- Struktur dari tabel `bagihasils`
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
-- Struktur dari tabel `jenissimpanans`
--

CREATE TABLE `jenissimpanans` (
  `id` int(11) NOT NULL,
  `jenis_simpanan` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `amount` int(11) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jenissimpanans`
--

INSERT INTO `jenissimpanans` (`id`, `jenis_simpanan`, `deskripsi`, `amount`, `created_by`, `created_at`) VALUES
(1, 'Wajib', 'simanan wajib', 2000000, 'Admin', '2023-08-31 02:54:58'),
(2, 'Sedekah', 'sedekah', 300000, 'Admin', '2023-09-11 03:30:57'),
(3, 'Pokok', 'okay', 1000000, 'Admin', '2023-09-11 14:09:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran`
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

--
-- Dumping data untuk tabel `pembayaran`
--

INSERT INTO `pembayaran` (`id`, `id_transaksi`, `angsuran_ke`, `jumlah_angsuran_bulan`, `sisa_angsuran`, `status`, `foto`, `created_at`) VALUES
(3, 2, '12', '91666.66666666667', 1000000, 'Sudah DIbayar', 'null', '2023-09-10 17:00:00'),
(4, 2, '11', '91666.66666666667', 908333, 'Pending', 'null', '2023-09-11 04:47:47'),
(5, 3, '12', '91666.66666666667', 1000000, 'Sudah DIbayar', 'null', '2023-09-10 17:00:00'),
(6, 3, '11', '91666.66666666667', 908333, 'Belum Lunas', 'null', '2023-09-11 05:29:46');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pinjamans`
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

--
-- Dumping data untuk tabel `pinjamans`
--

INSERT INTO `pinjamans` (`id`, `jenis_pinjaman`, `deskripsi`, `maksimal_pinjaman`, `lama_angsuran`, `bunga`, `created_by`, `created_at`) VALUES
(1, 'Wajib', 'okay', 1000000, 12, 10, 'Admin', '2023-09-11 03:33:28'),
(2, 'Pokok', 'deskripsi', 100000, 12, 1, 'Admin', '2023-09-11 14:10:07');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi_pinjamans`
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

--
-- Dumping data untuk tabel `transaksi_pinjamans`
--

INSERT INTO `transaksi_pinjamans` (`id`, `nama`, `jenis_pinjaman`, `tanggal_pengajuan`, `tanggal_pencairan`, `created_by`, `approved_by`, `created_at`, `status`, `jumlah_pinjaman`, `email`, `bunga`) VALUES
(2, 'siti', 'Wajib', '2023-09-11', '2023-09-11', 'User', 'Admin', '2023-09-11 04:38:23', 'Acc', 908333, 'siti@gmail.com', 100000),
(3, 'siti', 'Wajib', '2023-09-11', '2023-09-11', 'User', 'Admin', '2023-09-11 05:28:05', 'Acc', 908333, 'siti@gmail.com', 100000),
(4, 'siti', 'Wajib', '2023-09-11', NULL, 'User', 'Admin', '2023-09-11 13:09:38', 'pending', 1000000, 'siti@gmail.com', 100000),
(5, 'siti', 'Wajib', '2023-09-11', NULL, 'User', NULL, '2023-09-11 14:15:34', 'pending', 1000000, 'siti@gmail.com', 100000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi_simpanans`
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

--
-- Dumping data untuk tabel `transaksi_simpanans`
--

INSERT INTO `transaksi_simpanans` (`id`, `nama`, `jenis_simpan`, `deskripsi`, `besar_simpanan`, `created_by`, `created_at`, `email`) VALUES
(1, 'siti', 'Sedekah', 'sedekah', 500000, 'Admin', '2023-09-11 05:05:53', 'siti@gmail.com'),
(2, 'siti', 'Wajib', 'simanan wajib', 2000000, 'Admin', '2023-09-11 14:11:58', 'siti@gmail.com');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
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
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `nik`, `nip`, `name`, `alamat`, `status`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$EJCRXtyxffDT/rs5iK3sW.W2iiF7qw68NITX1l3tEHoUzj.lBPgOS', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(2, 'admin', 'admin2@gmail.com', '$2b$10$29tMOhLzZX84SXsDWRhW5Ok9FQTdNfg/sjwxwX1ld/h8NPMxRBRRG', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(3, 'admin', 'admin3@gmail.com', '$2b$10$LAqyNFggvuOnNHTGSdsv9.w4p1fQ8EncWJJ2rX/UQ8Eb1DbnArPVe', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(4, 'admin', 'admin4@gmail.com', '$2b$10$1L8V1ka54c4PMtySs20A4ecLqgcaMkc4Mk9EB4mJr4o.e2wkfpAR6', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(5, 'admin', 'admin5@gmail.com', '$2b$10$.nE6v7m2Xyz87JUY/kolj.nTPR23w9at1QXsb16RXbCeumNEUE2xC', 'Admin', 12345678, 12345678, 'admin', 'malang', 'active'),
(6, 'siti', 'siti@gmail.com', '$2b$10$vNLwItbenfg2cCLU8ntv4ejHtIHSFAz1nTRWneruO/Epvn510giF.', 'User', 123, 123, 'siti', 'malang', 'active'),
(7, 'dimas', 'dimas@gmail.com', '$2b$10$WktZShi5jLlBonz4vBR4xuW20bIUsaVe8w2Ykrd4HY1rzbaozun7q', 'User', 12345, 12345, 'dimas', 'malang', 'active');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bagihasils`
--
ALTER TABLE `bagihasils`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `jenissimpanans`
--
ALTER TABLE `jenissimpanans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pinjamans`
--
ALTER TABLE `pinjamans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `transaksi_pinjamans`
--
ALTER TABLE `transaksi_pinjamans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `transaksi_simpanans`
--
ALTER TABLE `transaksi_simpanans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bagihasils`
--
ALTER TABLE `bagihasils`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jenissimpanans`
--
ALTER TABLE `jenissimpanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `pinjamans`
--
ALTER TABLE `pinjamans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `transaksi_pinjamans`
--
ALTER TABLE `transaksi_pinjamans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `transaksi_simpanans`
--
ALTER TABLE `transaksi_simpanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
