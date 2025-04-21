import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DeCodedJWT } from 'src/app/models/jwt.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
})
export class LoginRegisterComponent {
  activeTab: 'login' | 'register' = 'login';

  userName: string = '';
  password: string = '';
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  
  login(): void {
    this.authService.login(this.userName, this.password).subscribe({
      next: ( jwt: string) => {
        localStorage.setItem('token', jwt);
        this.loginError = null;
        const decoded: DeCodedJWT = jwtDecode(jwt);

        localStorage.setItem('email', decoded.email);
        localStorage.setItem('username', decoded.user_name);
        localStorage.setItem('userId', decoded.sub);

        console.log('The login was successful');
        this.router.navigate(['']);
      },
      error: (err) => {
        this.loginError =
          'Login attempt failed. Please check your credentials.';
        console.error(err);
      },
    });
  }

  showLogin(): void {
    this.activeTab = 'login';
  }

  showRegister(): void {
    this.activeTab = 'register';
  }
}
