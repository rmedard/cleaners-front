import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../+services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  userLoggedIn = false;
  lang;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'fr';
    this.userLoggedIn = this.authService.loggedIn();
  }

  logout(): void {
    this.authService.logout();
  }

  changeLang(lang: any): void {
    localStorage.setItem('lang', lang);
    window.location.reload();
  }
}
