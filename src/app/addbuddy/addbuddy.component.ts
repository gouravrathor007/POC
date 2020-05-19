import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../_services';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

    this.addBuddyForm.controls.searchField.valueChanges
    .pipe( 
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((query) =>  this.userService.search(query))
    )
    .subscribe(results => this.users = results);
  }

}
