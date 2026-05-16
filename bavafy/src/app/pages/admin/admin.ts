import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SongService } from '../../services/song';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent implements OnInit {
  private songService = inject(SongService);
  private auth = inject(AuthService);
  private router = inject(Router);

  title = '';
  artist = '';
  album = '';
  genre = '';
  duration_sec = '';
  audioFile: File | null = null;
  coverFile: File | null = null;
  uploading = false;
  message = '';
  error = '';

  ngOnInit() {
    if (!this.auth.isSuperAdmin()) {
      this.router.navigate(['/home']);
    }
  }

  onAudioChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.audioFile = input.files?.[0] ?? null;
  }

  onCoverChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.coverFile = input.files?.[0] ?? null;
  }

  submit() {
    if (!this.title || !this.artist || !this.duration_sec || !this.audioFile) {
      this.error = 'Título, artista, duración y archivo de audio son requeridos.';
      return;
    }

    this.error = '';
    this.message = '';
    this.uploading = true;

    const fd = new FormData();
    fd.append('title', this.title);
    fd.append('artist', this.artist);
    fd.append('album', this.album);
    fd.append('genre', this.genre);
    fd.append('duration_sec', this.duration_sec);
    fd.append('file', this.audioFile);
    if (this.coverFile) fd.append('cover', this.coverFile);

    this.songService.uploadSong(fd).subscribe({
      next: res => {
        this.message = `✅ "${res.song.title}" subida correctamente`;
        this.uploading = false;
        this.title = this.artist = this.album = this.genre = this.duration_sec = '';
        this.audioFile = this.coverFile = null;
      },
      error: err => {
        this.error = err.error?.message ?? 'Error al subir la canción';
        this.uploading = false;
      }
    });
  }
}