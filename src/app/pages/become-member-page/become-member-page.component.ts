import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {faPlus, faUser, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {UserType} from '../../+models/user';

@Component({
  selector: 'app-become-member-page',
  templateUrl: './become-member-page.component.html',
  styleUrls: ['./become-member-page.component.scss']
})
export class BecomeMemberPageComponent implements OnInit {
  registrationForm: FormGroup;
  userIcon = faUser;
  professionalIcon = faUserTie;
  addIcon = faPlus;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      userTypeField: [UserType.CUSTOMER.valueOf(), Validators.required],
      regLastNameField: new FormControl('', [Validators.required]),
      regFirstNameField: new FormControl('', [Validators.required]),
      regEmailField: new FormControl('', [Validators.email]),
      regPasswordField: new FormControl('', [Validators.required]),
      regStreetField: new FormControl('', [Validators.required]),
      regPlotNumberField: new FormControl('', [Validators.required]),
      regCityField: new FormControl('', [Validators.required]),
      regPostalCodeField: new FormControl('', [Validators.required])
    });
  }

}
