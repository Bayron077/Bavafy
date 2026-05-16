import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { SongService, Song as ApiSong } from '../../services/song';

interface Song {
  id:       number;
  title:    string;
  artist:   string;
  album:    string;
  duration: string;
  cover:    string;
  file_path?: string;
}

interface Playlist {
  id:          number;
  name:        string;
  description: string;
  songs:       Song[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private songService = inject(SongService);

  user = computed(() => this.authService.currentUser());

  //── Player ──────────────────────────────────────────────────────
  currentSong: Song | null = null;
  isPlaying:   boolean = false;
  progress:    number  = 0;
  volume:      number  = 80;
  isMuted:     boolean = false;
  private audio = new Audio();

  //── Navegación ──────────────────────────────────────────────────
  activeSection: string = 'inicio';

  //── Búsqueda ────────────────────────────────────────────────────
  searchQuery:   string = '';
  searchResults: Song[] = [];

  // ── Me Gusta ────────────────────────────────────────────────────
  likedSongs: Song[]      = [];
  likedIds:   Set<number> = new Set();

  // ── Playlists ───────────────────────────────────────────────────
  playlists:           Playlist[]    = [];
  selectedPlaylist:    Playlist | null = null;
  showCreatePlaylist:  boolean        = false;
  newPlaylistName:     string         = '';
  newPlaylistDesc:     string         = '';
  private nextPlaylistId: number      = 1;

  // ── Canciones reales ────────────────────────────────────────────
  featuredSongs: Song[] = [];
  recentSongs:   Song[] = [];

  // ── Admin: subir canción ────────────────────────────────────────
  adminTitle       = '';
  adminArtist      = '';
  adminAlbum       = '';
  adminGenre       = '';
  adminDuration    = '';
  adminAudioFile:  File | null = null;
  adminCoverFile:  File | null = null;
  adminUploading   = false;
  adminMessage     = '';
  adminError       = '';

  ngOnInit() {
    this.loadSongs();
  }

  loadSongs() {
    this.songService.getAll().subscribe({
      next: res => {
        const mapped = res.songs.map(s => this.mapSong(s));
        this.featuredSongs = mapped.slice(0, 6);
        this.recentSongs   = mapped.slice(6, 10);
      },
      error: () => {}
    });
  }

  private mapSong(s: ApiSong): Song {
    const mins = Math.floor(s.duration_sec / 60);
    const secs = String(s.duration_sec % 60).padStart(2, '0');
    return {
      id:        s.id,
      title:     s.title,
      artist:    s.artist,
      album:     s.album ?? '',
      duration:  `${mins}:${secs}`,
      cover:     s.cover_url ? `http://localhost:3000/${s.cover_url}` : '',
      file_path: s.file_path,
    };
  }

  private get allSongs(): Song[] {
    return [...this.featuredSongs, ...this.recentSongs];
  }

  // ── Navegación ──────────────────────────────────────────────────
  setActiveSection(section: string): void {
    this.activeSection    = section;
    this.selectedPlaylist = null;
  }

  // ── Player ──────────────────────────────────────────────────────
  playSong(song: Song): void {
    this.audio.pause();
    this.currentSong = song;
    if (song.file_path) {
      this.audio.src = `http://localhost:3000/${song.file_path}`;
      this.audio.play();
      this.isPlaying = true;
      this.audio.ontimeupdate = () => {
        this.progress = this.audio.duration
          ? (this.audio.currentTime / this.audio.duration) * 100
          : 0;
      };
    }
  }

  togglePlay(): void {
    if (!this.currentSong) return;
    this.isPlaying ? this.audio.pause() : this.audio.play();
    this.isPlaying = !this.isPlaying;
  }

  nextSong(): void {
    if (!this.currentSong) return;
    const all = this.allSongs;
    const idx = all.findIndex(s => s.id === this.currentSong!.id);
    this.playSong(all[(idx + 1) % all.length]!);
  }

  prevSong(): void {
    if (!this.currentSong) return;
    const all = this.allSongs;
    const idx = all.findIndex(s => s.id === this.currentSong!.id);
    this.playSong(all[(idx - 1 + all.length) % all.length]!);
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
  }

  setVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.volume = Number(input.value);
    this.audio.volume = this.volume / 100;
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
      this.audio.muted = false;
    }
  }

  // ── Búsqueda ────────────────────────────────────────────────────
  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) { this.searchResults = []; return; }
    this.searchResults = this.allSongs.filter(s =>
      s.title.toLowerCase().includes(q)  ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)
    );
  }

  // ── Me Gusta ────────────────────────────────────────────────────
  toggleLike(song: Song, event: Event): void {
    event.stopPropagation();
    if (this.likedIds.has(song.id)) {
      this.likedIds.delete(song.id);
      this.likedSongs = this.likedSongs.filter(s => s.id !== song.id);
    } else {
      this.likedIds.add(song.id);
      this.likedSongs = [...this.likedSongs, song];
    }
  }

  isLiked(id: number): boolean { return this.likedIds.has(id); }

  // ── Playlists ───────────────────────────────────────────────────
  createPlaylist(): void {
    if (!this.newPlaylistName.trim()) return;
    this.playlists = [...this.playlists, {
      id: this.nextPlaylistId++,
      name: this.newPlaylistName.trim(),
      description: this.newPlaylistDesc.trim(),
      songs: [],
    }];
    this.newPlaylistName = '';
    this.newPlaylistDesc = '';
    this.showCreatePlaylist = false;
  }

  openPlaylist(playlist: Playlist): void {
    this.selectedPlaylist = playlist;
    this.activeSection    = 'biblioteca';
  }

  deletePlaylist(playlist: Playlist, event: Event): void {
    event.stopPropagation();
    this.playlists = this.playlists.filter(p => p.id !== playlist.id);
    if (this.selectedPlaylist?.id === playlist.id) this.selectedPlaylist = null;
  }

  removeSongFromPlaylist(song: Song, event: Event): void {
    event.stopPropagation();
    if (!this.selectedPlaylist) return;
    this.selectedPlaylist.songs = this.selectedPlaylist.songs.filter(s => s.id !== song.id);
  }

  // ── Admin ───────────────────────────────────────────────────────
  onAdminAudio(e: Event) {
    this.adminAudioFile = (e.target as HTMLInputElement).files?.[0] ?? null;
  }

  onAdminCover(e: Event) {
    this.adminCoverFile = (e.target as HTMLInputElement).files?.[0] ?? null;
  }

  submitSong() {
    if (!this.adminTitle || !this.adminArtist || !this.adminDuration || !this.adminAudioFile) {
      this.adminError = 'Título, artista, duración y audio son requeridos.';
      return;
    }
    this.adminError = '';
    this.adminMessage = '';
    this.adminUploading = true;

    const fd = new FormData();
    fd.append('title',        this.adminTitle);
    fd.append('artist',       this.adminArtist);
    fd.append('album',        this.adminAlbum);
    fd.append('genre',        this.adminGenre);
    fd.append('duration_sec', this.adminDuration);
    fd.append('file',         this.adminAudioFile);
    if (this.adminCoverFile) fd.append('cover', this.adminCoverFile);

    this.songService.uploadSong(fd).subscribe({
      next: res => {
        this.adminMessage   = `✅ "${res.song.title}" subida correctamente`;
        this.adminUploading = false;
        this.adminTitle = this.adminArtist = this.adminAlbum = this.adminGenre = this.adminDuration = '';
        this.adminAudioFile = this.adminCoverFile = null;
        this.loadSongs();
      },
      error: err => {
        this.adminError     = err.error?.message ?? 'Error al subir';
        this.adminUploading = false;
      }
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────
  logout(): void { this.authService.logout(); }

  getInitials(): string {
    return (this.user()?.name ?? '').slice(0, 2).toUpperCase();
  }

  getCoverColor(id: number): string {
    const colors = ['#8A0194','#6a0172','#4a0150','#b001c4','#3d0068','#cc00dd'];
    return colors[id % colors.length]!;
  }

  isSuperAdmin(): boolean {
    return this.user()?.role === 'superadmin';
  }
}