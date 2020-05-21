import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService, AlertService } from '../_services';
import { switchMap, debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addbuddy',
  templateUrl: './addbuddy.component.html',
  styleUrls: ['./addbuddy.component.less']
})
export class AddbuddyComponent implements OnInit {
  public addBuddyForm: FormGroup;
  public users: any;
  public userId: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    public router: Router
  ) {
    this.addBuddyForm = this.formBuilder.group({
      searchField: []
    });
  }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.userId;
    this.addBuddyForm.controls.searchField.valueChanges
    .pipe( 
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((query) =>  this.userService.search(query, this.userId))
    )
    .subscribe(results => this.users = results);
  }

  /**
   * @description Method be called to update add buddy
   * @param user 
   */
  public onSelect(user: any): void {
    const buddyName = user.firstName + ' ' + user.lastName;
    this.userService.updateBuddyName(buddyName, this.userId)
      .pipe(first())
      .subscribe(
        data => {
            this.alertService.success('Added Buddy!', true);
        },
        error => {
            this.alertService.error(error);
        });
      this.router.navigate(['/']);
  }
}
