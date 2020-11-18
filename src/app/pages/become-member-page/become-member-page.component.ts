import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {faEuroSign, faMinus, faPlus, faUser, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {User, UserType} from '../../+models/user';
import {Service} from '../../+models/service';
import {ServicesService} from '../../+services/services.service';
import {Address} from '../../+models/address';
import {Customer} from '../../+models/customer';
import {Professional} from '../../+models/professional';
import {Expertise} from '../../+models/expertise';
import {ProfessionalsService} from '../../+services/professionals.service';
import {ProfessionalForCreate} from '../../+models/dto/professional-for-create';
import {CustomersService} from '../../+services/customers.service';
import {CustomerForCreate} from '../../+models/dto/customer-for-create';
import {HttpErrorResponse} from '@angular/common/http';
import {Alert} from '../../+models/dto/alert';

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
  alerts: Alert[] = [];

  constructor(private formBuilder: FormBuilder,
              private servicesService: ServicesService,
              private professionalsService: ProfessionalsService,
              private customersService: CustomersService) {
  }

  ngOnInit(): void {
    this.servicesService.getServices().subscribe(data => {
      this.services = data;
      this.proposedServices = new FormArray([
        new FormGroup({
          regService: new FormControl(this.services[0]),
          regHourlyRate: new FormControl(0.00, [Validators.required, Validators.min(1)])
        })
      ], [Validators.required]);
    });
    this.registrationForm = this.formBuilder.group({
      userTypeField: [this.userType, Validators.required],
      regLastNameField: new FormControl('', [Validators.required]),
      regFirstNameField: new FormControl('', [Validators.required]),
      regEmailField: new FormControl('', [Validators.required, Validators.email]),
      regPhoneField: new FormControl('', [Validators.required]),
      regPasswordField: new FormControl('', [Validators.required]),
      regStreetField: new FormControl('', [Validators.required]),
      regPlotNumberField: new FormControl('', [Validators.required]),
      regCityField: new FormControl('', [Validators.required]),
      regPostalCodeField: new FormControl('', [Validators.required]),
      regProposedServices: this.proposedServices
    });
    this.setUserTypeValidators();
  }

  register(): void {
    const userDto = {
      firstName: this.registrationForm.controls.regFirstNameField.value,
      lastName: this.registrationForm.controls.regLastNameField.value,
      email: this.registrationForm.controls.regEmailField.value,
      picture: '',
      phoneNumber: this.registrationForm.controls.regPhoneField.value,
      address: {
        city: this.registrationForm.controls.regCityField.value,
        postalCode: this.registrationForm.controls.regPostalCodeField.value,
        plotNumber: this.registrationForm.controls.regPlotNumberField.value,
        streetName: this.registrationForm.controls.regStreetField.value
      } as Address
    } as User;
    if (this.registrationForm.controls.userTypeField.value === UserType.CUSTOMER.valueOf()) {
      this.customersService.createCustomer({
        customer: {
          user: userDto,
          isActive: true
        } as Customer,
        password: this.registrationForm.controls.regPasswordField.value
      } as CustomerForCreate).subscribe(data => {
        this.alerts.push({
          type: 'success',
          msg: 'You have been registered successfully. You can login!!',
          dismissible: true
        } as Alert);
      }, error => {
        console.log(error);
        const errorResponse = error as HttpErrorResponse;
        this.alerts.push({
          type: 'danger',
          msg: `Failed to register: ${errorResponse.error}`,
          dismissible: true
        } as Alert);
      });
    } else if (this.registrationForm.controls.userTypeField.value === UserType.PROFESSIONAL.valueOf()) {
      const newProfessional = {
        user: userDto,
        expertises: [],
        isActive: true
      } as Professional;
      this.proposedServices.controls.forEach(control => {
        const formGroup = control as FormGroup;
        const serv = formGroup.controls.regService.value as Service;
        const rate = formGroup.controls.regHourlyRate.value as number;
        newProfessional.expertises.push({
          service: serv,
          hourlyRate: rate
        } as Expertise);
      });
      this.professionalsService.createProfessional({
        professional: newProfessional,
        password: this.registrationForm.controls.regPasswordField.value
      } as ProfessionalForCreate).subscribe(data => {
        this.alerts.push({
          type: 'success',
          msg: 'You have been registered successfully. You can login!!',
          dismissible: true
        } as Alert);
      }, error => {
        console.log(error);
        const errorResponse = error as HttpErrorResponse;
        this.alerts.push({
          type: 'danger',
          msg: `Failed to register: ${errorResponse.error}`,
          dismissible: true
        } as Alert);
      });
    }
  }

  toggleUserType(userType: string): void {
    if (this.userType !== userType) {
      this.userType = userType;
    }
  }

  isFormValid(): boolean {
    return this.registrationForm.valid && this.areProposedServicesGroupValid();
  }

  areProposedServicesGroupValid(): boolean {
    let isValid = true;
    if (this.registrationForm.controls.userTypeField.value === UserType.PROFESSIONAL.valueOf()) {
      let allValid = true;
      this.proposedServices.controls.map(c => {
        return c as FormGroup;
      }).forEach(c => {
        if (!c.controls.regService.valid || !c.controls.regHourlyRate.valid) {
          allValid = false;
        }
      });
      isValid = this.registrationForm.controls.regProposedServices.valid && allValid;
    }
    return isValid;
  }

  setUserTypeValidators(): void {
    const proposedServicesControl = this.registrationForm.controls.regProposedServices;
    this.registrationForm.get('userTypeField').valueChanges.subscribe(userType => {
      if (userType === UserType.CUSTOMER.valueOf()) {
        proposedServicesControl.setValidators(null);
      }

      if (userType === UserType.PROFESSIONAL.valueOf()) {
        proposedServicesControl.setValidators([Validators.required]);
      }
    });
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

  onClosed(dismissedAlert: Alert): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
