import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SongService, Song } from '../../services/song';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private songService = inject(SongService);
  auth = inject(AuthService);

  songs: Song[] = [];
  currentSong: Song | null = null;
  audioPlayer = new Audio();
  isPlaying = false;

  ngOnInit() {
    this.songService.getAll().subscribe(res => {
      this.songs = res.songs;
    });
  }

  play(song: Song) {
    if (this.currentSong?.id === song.id) {
      this.isPlaying ? this.audioPlayer.pause() : this.audioPlayer.play();
      this.isPlaying = !this.isPlaying;
      return;
    }
    this.audioPlayer.pause();
    this.currentSong = song;
    this.audioPlayer.src = `${window.location.origin.replace('4200','3000')}/${song.file_path}`;
    this.audioPlayer.play();
    this.isPlaying = true;
  }

  getColor(index: number): string {
    const colors = ['#7B2FF7','#4B0082','#9B30FF','#6A0DAD','#BF5FFF','#5B2C9F'];
    return colors[index % colors.length];
  }
}