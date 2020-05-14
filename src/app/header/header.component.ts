import { Component } from '@angular/core';
import { AuthenticationService } from '../_services';
import { Router } from '@angular/router';
import { ModalService } from '../_modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {

  public currentUser: string;
  public bodyText: string;

  constructor(
    private router: Router,
    private modalService: ModalService,
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
  /**
     * @description method to be call when user update the text in popup
     */
    public ngOnInit() {
      this.bodyText = 'This text can be updated in modal 1';
  }

  /**
   * @description method to be called when popup window open
   * @param id 
   */
  public openModal(id: string) {
      this.modalService.open(id);
  }

  /**
   * @description Method to be called when user close the popup window close
   * @param id 
   */
  public closeModal(id: string) {
      this.modalService.close(id);
  }

}
