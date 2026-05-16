import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Song {
  id:           number;
  title:        string;
  artist:       string;
  album:        string | null;
  genre:        string | null;
  duration_sec: number;
  file_path:    string;
  cover_url:    string | null;
}

export interface Playlist {
  id:          number;
  name:        string;
  description: string;
  user_id:     number;
}

@Injectable({ providedIn: 'root' })
export class SongService {
  private readonly api      = `${environment.apiUrl}/songs`;
  private readonly likeApi  = `${environment.apiUrl}/likes`;
  private readonly plApi    = `${environment.apiUrl}/playlists`;

  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── Canciones ───────────────────────────────────────────────
  getAll() {
    return this.http.get<{ total: number; songs: Song[] }>(
      this.api, { headers: this.headers() }
    );
  }

  uploadSong(formData: FormData) {
    return this.http.post<{ message: string; song: Song }>(
      this.api, formData, { headers: this.headers() }
    );
  }

  // ── Likes ───────────────────────────────────────────────────
  getMyLikes() {
    return this.http.get<{ likes: { song_id: number }[] }>(
      this.likeApi, { headers: this.headers() }
    );
  }

  addLike(songId: number) {
    return this.http.post<{ message: string }>(
      `${this.likeApi}/${songId}`, {}, { headers: this.headers() }
    );
  }

  removeLike(songId: number) {
    return this.http.delete<{ message: string }>(
      `${this.likeApi}/${songId}`, { headers: this.headers() }
    );
  }

  // ── Playlists ───────────────────────────────────────────────
  getMyPlaylists() {
    return this.http.get<{ playlists: Playlist[] }>(
      this.plApi, { headers: this.headers() }
    );
  }

  createPlaylist(name: string, description: string) {
    return this.http.post<{ playlist: Playlist }>(
      this.plApi, { name, description }, { headers: this.headers() }
    );
  }

  deletePlaylist(id: number) {
    return this.http.delete<{ message: string }>(
      `${this.plApi}/${id}`, { headers: this.headers() }
    );
  }

  addSongToPlaylist(playlistId: number, songId: number) {
    return this.http.post<{ message: string }>(
      `${this.plApi}/${playlistId}/songs`, { song_id: songId }, { headers: this.headers() }
    );
  }

  removeSongFromPlaylist(playlistId: number, songId: number) {
    return this.http.delete<{ message: string }>(
      `${this.plApi}/${playlistId}/songs/${songId}`, { headers: this.headers() }
    );
  }

  getPlaylistById(id: number) {
    return this.http.get<any>(
      `${this.plApi}/${id}`, { headers: this.headers() }
    );
  }
}