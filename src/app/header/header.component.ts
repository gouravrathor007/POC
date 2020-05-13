import { Component } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {

  public currentUser: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  /**
   * @description Method to be called when user has to logout
   * @returns void
   */
  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
