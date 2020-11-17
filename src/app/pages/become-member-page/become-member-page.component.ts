import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {faEuroSign, faMinus, faPlus, faUser, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {UserType} from '../../+models/user';
import {Service} from '../../+models/service';
import {ServicesService} from '../../+services/services.service';

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
  removeIcon = faMinus;
  euroIcon = faEuroSign;
  services: Service[] = [];
  proposedServices: FormArray = {} as FormArray;
  userType = UserType.CUSTOMER.valueOf();

  constructor(private formBuilder: FormBuilder, private servicesService: ServicesService) {
  }

  ngOnInit(): void {
    this.servicesService.getServices().subscribe(data => {
      this.services = data;
      this.proposedServices = new FormArray([
        new FormGroup({
          regService: new FormControl(this.services[0]),
          regHourlyRate: new FormControl(0.00, [Validators.min(0)])
        })
      ]);
    });
    this.registrationForm = this.formBuilder.group({
      userTypeField: [this.userType, Validators.required],
      regLastNameField: new FormControl('', [Validators.required]),
      regFirstNameField: new FormControl('', [Validators.required]),
      regEmailField: new FormControl('', [Validators.email]),
      regPasswordField: new FormControl('', [Validators.required]),
      regStreetField: new FormControl('', [Validators.required]),
      regPlotNumberField: new FormControl('', [Validators.required]),
      regCityField: new FormControl('', [Validators.required]),
      regPostalCodeField: new FormControl('', [Validators.required]),
      regProposedServices: this.proposedServices
    });
  }

  toggleUserType(userType: string): void {
    if (this.userType !== userType) {
      this.userType = userType;
    }
  }

  removeProposedService(index: number): void {
    this.proposedServices.removeAt(index);
  }

  addProposedService(): void {
    this.proposedServices.insert(this.proposedServices.length, new FormGroup({
      regService: new FormControl(this.services.filter(s => !this.isSelected(s))[0]),
      regHourlyRate: new FormControl(0.00, [Validators.min(0)])
    }));
  }

  isSelected(service: Service): boolean {
    const selectedServices = this.proposedServices.controls.map(c => {
      const formGroup = c as FormGroup;
      return formGroup.controls.regService.value as Service;
    }) as Service[];
    return selectedServices.includes(service);
  }

  canAddServices(): boolean {
    return this.proposedServices.length === this.services.length;
  }
}
