import { Component, OnInit, computed, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { SongService, Song as ApiSong, Playlist as ApiPlaylist } from '../../services/song';

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
  private cdr         = inject(ChangeDetectorRef);

  @ViewChild('progressBar') progressBar!: ElementRef<HTMLInputElement>;

  user = computed(() => this.authService.currentUser());

  //── Player ──────────────────────────────────────────────────
  currentSong: Song | null = null;
  isPlaying   = false;
  progress    = 0;
  currentTime = '0:00';
  volume      = 80;
  isMuted     = false;
  private audio = new Audio();

  //── Navegación ──────────────────────────────────────────────
  activeSection = 'inicio';

  //── Búsqueda ────────────────────────────────────────────────
  searchQuery   = '';
  searchResults: Song[] = [];

  //── Me Gusta ────────────────────────────────────────────────
  likedSongs: Song[]      = [];
  likedIds:   Set<number> = new Set();

  //── Playlists ───────────────────────────────────────────────
  playlists:          Playlist[]      = [];
  selectedPlaylist:   Playlist | null = null;
  showCreatePlaylist  = false;
  newPlaylistName     = '';
  newPlaylistDesc     = '';

  //── Canciones ───────────────────────────────────────────────
  featuredSongs: Song[] = [];
  recentSongs:   Song[] = [];

  //── Admin ────────────────────────────────────────────────────
  adminTitle      = '';
  adminArtist     = '';
  adminAlbum      = '';
  adminGenre      = '';
  adminDuration   = '';
  adminAudioFile: File | null = null;
  adminCoverFile: File | null = null;
  adminUploading  = false;
  adminMessage    = '';
  adminError      = '';

  //── Modal agregar a playlist ─────────────────────────────────
  showPlaylistModal  = false;
  songToAdd: Song | null = null;

  ngOnInit() {
    this.loadSongs();
    this.loadLikes();
    this.loadPlaylists();
    this.audio.volume = this.volume / 100;

    this.audio.ontimeupdate = () => {
      this.progress = this.audio.duration
        ? (this.audio.currentTime / this.audio.duration) * 100 : 0;
      const mins = Math.floor(this.audio.currentTime / 60);
      const secs = String(Math.floor(this.audio.currentTime % 60)).padStart(2, '0');
      this.currentTime = `${mins}:${secs}`;
      if (this.progressBar) {
        this.progressBar.nativeElement.value = String(this.progress);
      }
      this.cdr.detectChanges();
    };

    this.audio.onended = () => {
      this.isPlaying   = false;
      this.progress    = 0;
      this.currentTime = '0:00';
      if (this.progressBar) this.progressBar.nativeElement.value = '0';
      this.cdr.detectChanges();
    };
  }

  //── Cargar datos ────────────────────────────────────────────
  loadSongs() {
    this.songService.getAll().subscribe({
      next: res => {
        const mapped = res.songs.map(s => this.mapSong(s));
        this.featuredSongs = mapped.slice(0, 6);
        this.recentSongs   = mapped.slice(6, 10);
      }
    });
  }

  loadLikes() {
    this.songService.getMyLikes().subscribe({
      next: res => {
        this.likedIds = new Set(res.likes.map(l => l.song_id));
        this.updateLikedSongs();
      }
    });
  }

  loadPlaylists() {
    this.songService.getMyPlaylists().subscribe({
      next: res => {
        this.playlists = (res.playlists ?? []).map((p: ApiPlaylist) => ({
          id: p.id, name: p.name, description: p.description, songs: []
        }));
      }
    });
  }

  private updateLikedSongs() {
    const all = [...this.featuredSongs, ...this.recentSongs];
    this.likedSongs = all.filter(s => this.likedIds.has(s.id));
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

  //── Navegación ──────────────────────────────────────────────
  setActiveSection(section: string): void {
    this.activeSection    = section;
    this.selectedPlaylist = null;
  }

  //── Player ──────────────────────────────────────────────────
  playSong(song: Song): void {
    this.audio.pause();
    this.currentSong = song;
    if (song.file_path) {
      this.audio.src = `http://localhost:3000/${song.file_path}`;
      this.audio.play();
      this.isPlaying = true;
    }
  }

  togglePlay(): void {
    if (!this.currentSong) return;
    this.isPlaying ? this.audio.pause() : this.audio.play();
    this.isPlaying = !this.isPlaying;
  }

  seekTo(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.audio.currentTime = (Number(input.value) / 100) * this.audio.duration;
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
    this.isMuted     = !this.isMuted;
    this.audio.muted = this.isMuted;
  }

  setVolume(e: Event): void {
    this.volume          = Number((e.target as HTMLInputElement).value);
    this.audio.volume    = this.volume / 100;
    this.isMuted         = this.volume === 0;
  }

  //── Búsqueda ────────────────────────────────────────────────
  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) { this.searchResults = []; return; }
    this.searchResults = this.allSongs.filter(s =>
      s.title.toLowerCase().includes(q)  ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)
    );
  }

  //── Me Gusta ────────────────────────────────────────────────
  toggleLike(song: Song, event: Event): void {
    event.stopPropagation();
    if (this.likedIds.has(song.id)) {
      this.songService.removeLike(song.id).subscribe({
        next: () => {
          this.likedIds.delete(song.id);
          this.likedSongs = this.likedSongs.filter(s => s.id !== song.id);
        }
      });
    } else {
      this.songService.addLike(song.id).subscribe({
        next: () => {
          this.likedIds.add(song.id);
          this.likedSongs = [...this.likedSongs, song];
        }
      });
    }
  }

  isLiked(id: number): boolean { return this.likedIds.has(id); }

  //── Playlists ───────────────────────────────────────────────
  createPlaylist(): void {
    if (!this.newPlaylistName.trim()) return;
    this.songService.createPlaylist(this.newPlaylistName.trim(), this.newPlaylistDesc.trim()).subscribe({
      next: res => {
        this.playlists      = [...this.playlists, { ...res.playlist, songs: [] }];
        this.newPlaylistName    = '';
        this.newPlaylistDesc    = '';
        this.showCreatePlaylist = false;
      }
    });
  }

  openPlaylist(playlist: Playlist): void {
    this.songService.getPlaylistById(playlist.id).subscribe({
      next: res => {
        const songs = (res.playlist?.songs ?? res.songs ?? []).map((s: any) => this.mapSong(s));
        this.selectedPlaylist = { ...playlist, songs };
        this.activeSection    = 'biblioteca';
      }
    });
  }

  deletePlaylist(playlist: Playlist, event: Event): void {
    event.stopPropagation();
    this.songService.deletePlaylist(playlist.id).subscribe({
      next: () => {
        this.playlists = this.playlists.filter(p => p.id !== playlist.id);
        if (this.selectedPlaylist?.id === playlist.id) this.selectedPlaylist = null;
      }
    });
  }

  removeSongFromPlaylist(song: Song, event: Event): void {
    event.stopPropagation();
    if (!this.selectedPlaylist) return;
    this.songService.removeSongFromPlaylist(this.selectedPlaylist.id, song.id).subscribe({
      next: () => {
        this.selectedPlaylist!.songs = this.selectedPlaylist!.songs.filter(s => s.id !== song.id);
      }
    });
  }

  //── Modal agregar a playlist ─────────────────────────────────
  openAddToPlaylist(song: Song, event: Event): void {
    event.stopPropagation();
    this.songToAdd         = song;
    this.showPlaylistModal = true;
  }

  addToPlaylist(playlist: Playlist): void {
    if (!this.songToAdd) return;
    this.songService.addSongToPlaylist(playlist.id, this.songToAdd.id).subscribe({
      next: () => {
        this.showPlaylistModal = false;
        this.songToAdd         = null;
      }
    });
  }

  closeModal(): void {
    this.showPlaylistModal = false;
    this.songToAdd         = null;
  }

  //── Admin ────────────────────────────────────────────────────
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
    this.adminError     = '';
    this.adminMessage   = '';
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

  //── Helpers ──────────────────────────────────────────────────
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