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

@Injectable({ providedIn: 'root' })
export class SongService {
  private readonly api = `${environment.apiUrl}/songs`;

  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

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
}