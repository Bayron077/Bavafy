-- ============================================================
--  Music Player App — Schema MySQL
--  Curso: Programación Web · UTP · 2026-1
-- ============================================================

CREATE DATABASE IF NOT EXISTS bavafy_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bavafy_db;

-- ------------------------------------------------------------
-- 1. users
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT             NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('superadmin','user') NOT NULL DEFAULT 'user',
  avatar_url    VARCHAR(500)    DEFAULT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_users_email (email),
  INDEX idx_users_role  (role)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. songs
-- ------------------------------------------------------------
CREATE TABLE songs (
  id            INT             NOT NULL AUTO_INCREMENT,
  title         VARCHAR(200)    NOT NULL,
  artist        VARCHAR(150)    NOT NULL,
  album         VARCHAR(150)    DEFAULT NULL,
  genre         VARCHAR(80)     DEFAULT NULL,
  duration_sec  INT UNSIGNED    NOT NULL COMMENT 'Duración en segundos',
  file_path     VARCHAR(500)    NOT NULL COMMENT 'Ruta relativa: uploads/songs/archivo.mp3',
  cover_url     VARCHAR(500)    DEFAULT NULL,
  uploaded_by   INT             NOT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_songs_title   (title),
  INDEX idx_songs_artist  (artist),
  INDEX idx_songs_genre   (genre),
  CONSTRAINT fk_songs_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. playlists
-- ------------------------------------------------------------
CREATE TABLE playlists (
  id            INT             NOT NULL AUTO_INCREMENT,
  name          VARCHAR(150)    NOT NULL,
  description   VARCHAR(500)    DEFAULT NULL,
  user_id       INT             NOT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_playlists_user (user_id),
  CONSTRAINT fk_playlists_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. playlist_songs  (tabla intermedia N:M)
-- ------------------------------------------------------------
CREATE TABLE playlist_songs (
  id            INT             NOT NULL AUTO_INCREMENT,
  playlist_id   INT             NOT NULL,
  song_id       INT             NOT NULL,
  position      SMALLINT        NOT NULL DEFAULT 0 COMMENT 'Orden dentro de la playlist',
  added_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE  KEY uq_playlist_song (playlist_id, song_id),
  INDEX   idx_ps_song          (song_id),
  CONSTRAINT fk_ps_playlist
    FOREIGN KEY (playlist_id) REFERENCES playlists (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ps_song
    FOREIGN KEY (song_id) REFERENCES songs (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;