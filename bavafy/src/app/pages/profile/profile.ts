import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

interface Song {
  id:       number;
  title:    string;
  artist:   string;
  album:    string;
  duration: string;
  cover:    string;
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
export class ProfileComponent {

  // ── Auth ────────────────────────────────────────────────────
  user = computed(() => this.authService.currentUser());

  // ── Player ──────────────────────────────────────────────────
  currentSong: Song | null = null;
  isPlaying:   boolean = false;
  progress:    number  = 30;
  volume:      number  = 80;
  isMuted:     boolean = false;

  // ── Navegación ──────────────────────────────────────────────
  activeSection: string = 'inicio';

  // ── Búsqueda ────────────────────────────────────────────────
  searchQuery:   string = '';
  searchResults: Song[] = [];

  // ── Me Gusta ────────────────────────────────────────────────
  likedSongs: Song[]      = [];
  likedIds:   Set<number> = new Set();

  // ── Playlists ───────────────────────────────────────────────
  playlists:           Playlist[]    = [];
  selectedPlaylist:    Playlist | null = null;
  showCreatePlaylist:  boolean        = false;
  newPlaylistName:     string         = '';
  newPlaylistDesc:     string         = '';
  private nextPlaylistId: number      = 1;

  // ── Canciones de prueba (luego vienen del backend) ──────────
  featuredSongs: Song[] = [
    { id: 1,  title: 'Blinding Lights', artist: 'The Weeknd',     album: 'After Hours',      duration: '3:20', cover: '' },
    { id: 2,  title: 'Stay',            artist: 'Kid LAROI',      album: 'F*CK LOVE 3',      duration: '2:21', cover: '' },
    { id: 3,  title: 'Levitating',      artist: 'Dua Lipa',       album: 'Future Nostalgia', duration: '3:23', cover: '' },
    { id: 4,  title: 'Peaches',         artist: 'Justin Bieber',  album: 'Justice',          duration: '3:18', cover: '' },
    { id: 5,  title: 'Good 4 U',        artist: 'Olivia Rodrigo', album: 'SOUR',             duration: '2:58', cover: '' },
    { id: 6,  title: 'Montero',         artist: 'Lil Nas X',      album: 'Montero',          duration: '2:17', cover: '' },
  ];

  recentSongs: Song[] = [
    { id: 7,  title: 'Heat Waves',      artist: 'Glass Animals',  album: 'Dreamland', duration: '3:59', cover: '' },
    { id: 8,  title: 'Industry Baby',   artist: 'Lil Nas X',      album: 'Montero',   duration: '3:32', cover: '' },
    { id: 9,  title: 'Love Story',      artist: 'Taylor Swift',   album: 'Fearless',  duration: '3:55', cover: '' },
    { id: 10, title: 'Drivers License', artist: 'Olivia Rodrigo', album: 'SOUR',      duration: '4:02', cover: '' },
  ];

  private get allSongs(): Song[] {
    return [...this.featuredSongs, ...this.recentSongs];
  }

  constructor(private authService: AuthService) {}

  // ── Navegación ──────────────────────────────────────────────
  setActiveSection(section: string): void {
    this.activeSection    = section;
    this.selectedPlaylist = null;
  }

  // ── Player ──────────────────────────────────────────────────
  playSong(song: Song): void {
    this.currentSong = song;
    this.isPlaying   = true;
  }

  togglePlay(): void {
    if (this.currentSong) this.isPlaying = !this.isPlaying;
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
  }

  // ── Búsqueda ────────────────────────────────────────────────
  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) { this.searchResults = []; return; }
    this.searchResults = this.allSongs.filter(s =>
      s.title.toLowerCase().includes(q)  ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)
    );
  }

  // ── Me Gusta ────────────────────────────────────────────────
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

  isLiked(id: number): boolean {
    return this.likedIds.has(id);
  }

  // ── Playlists ───────────────────────────────────────────────
  createPlaylist(): void {
    if (!this.newPlaylistName.trim()) return;
    const playlist: Playlist = {
      id:          this.nextPlaylistId++,
      name:        this.newPlaylistName.trim(),
      description: this.newPlaylistDesc.trim(),
      songs:       [],
    };
    this.playlists          = [...this.playlists, playlist];
    this.newPlaylistName    = '';
    this.newPlaylistDesc    = '';
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

  // ── Helpers ─────────────────────────────────────────────────
  logout(): void {
    this.authService.logout();
  }

  getInitials(): string {
    const name = this.user()?.name ?? '';
    return name.slice(0, 2).toUpperCase();
  }

  getCoverColor(id: number): string {
    const colors = ['#8A0194', '#6a0172', '#4a0150', '#b001c4', '#3d0068', '#cc00dd'];
    return colors[id % colors.length]!;
  }
}