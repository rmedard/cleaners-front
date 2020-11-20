import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../+services/auth.service';
import {LoggedInUser} from '../../+models/dto/logged-in-user';
import {Alert} from '../../+models/dto/alert';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {
  loginForm: FormGroup;
  alerts: Alert[] = [];

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      loginEmailField: new FormControl('', [Validators.required, Validators.email]),
      loginPasswordField: new FormControl('', [Validators.required])
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls.loginEmailField.value;
      const password = this.loginForm.controls.loginPasswordField.value;
      this.authService.login(email, password).subscribe(loggedInUser => {
        localStorage.setItem('user', JSON.stringify(loggedInUser as LoggedInUser));
        this.router.navigate(['/profile']).then(() => {
          window.location.reload();
        });
        this.translateService.getTranslation('msg_login_success').subscribe(message => {
          this.alerts.push({
            type: 'success',
            msg: message,
            dismissible: true
          } as Alert);
        });
      }, error => {
        this.translateService.getTranslation('msg_login_fail').subscribe(message => {
          this.alerts.push({
            type: 'danger',
            msg: message,
            dismissible: true
          } as Alert);
        });
      });
    }
  }

  onClosed(dismissedAlert: Alert): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
