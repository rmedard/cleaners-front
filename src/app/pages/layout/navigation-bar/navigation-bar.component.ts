import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../+services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  userLoggedIn = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userLoggedIn = this.authService.loggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}
