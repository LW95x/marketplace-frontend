import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DeCodedJWT } from 'src/app/models/jwt.model';
import { jwtDecode } from 'jwt-decode';
import { UsersService } from 'src/app/services/users.service';
import { CreateUser } from 'src/app/models/user.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
})
export class LoginRegisterComponent {
  activeTab: 'login' | 'register' = 'login';

  userName: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  usernameInput$ = new Subject<string>();
  usernameAvailable: boolean | null = null;

  loginError: string | null = null;

  constructor(private authService: AuthService, private usersService: UsersService, private router: Router) {}

  ngOnInit() {
    this.usernameInput$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
    .subscribe( (username) => {
      if (!username) {
        this.usernameAvailable = null;
        return;
      }

      this.usersService.getUserByUserName(username).subscribe({
        next: () => {
          this.usernameAvailable = false;
          console.log("The username already exists.");
        },
        error: (err) => {
          this.usernameAvailable = true;
          console.log("The username is available.");
        }
      })
    })
  }

  
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

  register(): void {
    // If password == confirmPassword && unique username
    const newUser: CreateUser = {
      email: this.email,
      userName: this.userName,
      password: this.password
    }

    this.usersService.addNewUser(newUser).subscribe({
      next: () => {
        console.log('User succesfully registered.');
      },
      error: (err) => {
        console.error('User could not be registered', err);
      }
    })
  }

  showLogin(): void {
    this.activeTab = 'login';
  }

  showRegister(): void {
    this.activeTab = 'register';
  }

  onUsernameInput(username: string) {
    this.usernameInput$.next(username);
  }
}
