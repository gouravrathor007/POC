import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../_services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-addbuddy',
  templateUrl: './addbuddy.component.html',
  styleUrls: ['./addbuddy.component.less']
})
export class AddbuddyComponent implements OnInit {
  public addBuddyForm: FormGroup;
  public users: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.addBuddyForm = this.formBuilder.group({
      searchField: []
    });
  }

  ngOnInit() {

    const searchField = new FormControl();
    searchField.valueChanges
    .pipe( 
      /* debounceTime(200),
      distinctUntilChanged(), */
      map((query) =>  this.userService.search(query))
    )

    .subscribe(results => this.users = results) 
  }

}
