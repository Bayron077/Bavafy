import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  // Cancion actualmente reproduciendose
  currentSong: Song | null = null;
  isPlaying: boolean = false;
  progress: number = 30; // porcentaje simulado
  volume: number = 80;
  isMuted: boolean = false;

  // Seccion activa del sidebar
  activeSection: string = 'inicio';

  // Usuario simulado (luego viene del AuthService)
  userName: string = "";

  // Canciones de prueba (luego vienen del backend)
  featuredSongs: Song[] = [
    { id: 1, title: 'Blinding Lights',   artist: 'The Weeknd',       album: 'After Hours',     duration: '3:20', cover: '' },
    { id: 2, title: 'Stay',              artist: 'Kid LAROI',        album: 'F*CK LOVE 3',     duration: '2:21', cover: '' },
    { id: 3, title: 'Levitating',        artist: 'Dua Lipa',         album: 'Future Nostalgia', duration: '3:23', cover: '' },
    { id: 4, title: 'Peaches',           artist: 'Justin Bieber',    album: 'Justice',         duration: '3:18', cover: '' },
    { id: 5, title: 'Good 4 U',          artist: 'Olivia Rodrigo',   album: 'SOUR',            duration: '2:58', cover: '' },
    { id: 6, title: 'Montero',           artist: 'Lil Nas X',        album: 'Montero',         duration: '2:17', cover: '' },
  ];

  recentSongs: Song[] = [
    { id: 7, title: 'Heat Waves',        artist: 'Glass Animals',    album: 'Dreamland',       duration: '3:59', cover: '' },
    { id: 8, title: 'Industry Baby',     artist: 'Lil Nas X',        album: 'Montero',         duration: '3:32', cover: '' },
    { id: 9, title: 'Love Story',        artist: 'Taylor Swift',     album: 'Fearless',        duration: '3:55', cover: '' },
    { id: 10, title: 'Drivers License', artist: 'Olivia Rodrigo',   album: 'SOUR',            duration: '4:02', cover: '' },
  ];

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  playSong(song: Song): void {
    this.currentSong = song;
    this.isPlaying = true;
  }

  togglePlay(): void {
    if (this.currentSong) {
      this.isPlaying = !this.isPlaying;
    }
  }

  nextSong(): void {
    if (!this.currentSong) return;
    const all = [...this.featuredSongs, ...this.recentSongs];
    const idx = all.findIndex(s => s.id === this.currentSong!.id);
    const next = all[(idx + 1) % all.length];
    this.playSong(next);
  }

  prevSong(): void {
    if (!this.currentSong) return;
    const all = [...this.featuredSongs, ...this.recentSongs];
    const idx = all.findIndex(s => s.id === this.currentSong!.id);
    const prev = all[(idx - 1 + all.length) % all.length];
    this.playSong(prev);
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  logout(): void {
    // TODO: llamar AuthService.logout()
    console.log('Logout');
  }

  // Genera iniciales para el avatar
  getInitials(): string {
    return this.userName.slice(0, 2).toUpperCase();
  }

  // Color de fondo simulado para portadas sin imagen
  getCoverColor(id: number): string {
    const colors = ['#8A0194', '#6a0172', '#4a0150', '#b001c4', '#3d0068', '#cc00dd'];
    return colors[id % colors.length];
  }
}
