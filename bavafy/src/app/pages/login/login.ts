import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  handleLogin(): void {
    this.errorMessage = '';

    // Validación campos vacíos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    // Validación formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Ingresa un correo electrónico válido.';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        const status = err?.status;
        if (status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else if (status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.';
        } else {
          this.errorMessage = err?.error?.message || 'Ocurrió un error inesperado.';
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}