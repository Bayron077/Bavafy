import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  name:            string  = '';
  email:           string  = '';
  password:        string  = '';
  confirmPassword: string  = '';
  errorMessage:    string  = '';
  successMessage:  string  = '';
  isLoading:       boolean = false;
  showPassword:    boolean = false;
  showConfirm:     boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirm():  void { this.showConfirm  = !this.showConfirm;  }

  handleRegister(): void {
    this.errorMessage  = '';
    this.successMessage = '';

    // Validaciones
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    if (this.name.trim().length < 2) {
      this.errorMessage = 'El nombre debe tener al menos 2 caracteres.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Ingresa un correo electrónico válido.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.successMessage = '¡Cuenta creada exitosamente! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        const status = err?.status;
        if (status === 409) {
          this.errorMessage = 'Este correo ya está registrado.';
        } else if (status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.';
        } else {
          this.errorMessage = err?.error?.message || 'Error al crear la cuenta. Intenta de nuevo.';
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}