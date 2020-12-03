import {Component, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from '../../+services/auth.service';
import {User, UserType} from '../../+models/user';
import {Customer} from '../../+models/customer';
import {Professional} from '../../+models/professional';
import {ProfessionalsService} from '../../+services/professionals.service';
import {CustomersService} from '../../+services/customers.service';
import {Alert} from '../../+models/dto/alert';
import * as moment from 'moment';
import {Reservation, Status} from '../../+models/reservation';
import {faEuroSign, faMinus, faPlus, faPlusCircle, faUser, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ServicesService} from '../../+services/services.service';
import {Category, Service} from '../../+models/service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileUploader, FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import CloudinaryConfiguration from '@cloudinary/angular-5.x/lib/cloudinary-configuration.class';
import {UsersService} from '../../+services/users.service';
import {LoggedInUser} from '../../+models/dto/logged-in-user';
import {Expertise} from '../../+models/expertise';
import {ReservationService} from '../../+services/reservation.service';
import {RoleUser} from '../../+models/role-user';
import {Role} from '../../+models/role';
import {Router} from '@angular/router';
import {ReservationSearchCriteriaDto} from '../../+models/dto/reservation-search-criteria-dto';
import * as _ from 'underscore';
import {AddExpertiseToProfessional} from '../../+models/dto/add-expertise-to-professional';
import {Label} from '../../+models/recurrence';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  user: User = {} as User;
  customer: Customer;
  professional: Professional;
  alerts: Alert[] = [];
  euroIcon = faEuroSign;
  plusIcon = faPlus;
  removeIcon = faMinus;
  expertiseForm: FormGroup;
  addExpertiseForm: FormGroup;
  services: Service[];
  selectedServiceForEdit: Service = {} as Service;
  closeResult = '';
  cloudinary = environment.cloudinaryConfig as CloudinaryConfiguration;
  expertiseToEdit: Expertise;
  upcomingReservations: Reservation[];
  pastReservations: Reservation[];
  upcomingProfessionalReservations: Reservation[] = [];
  pastProfessionalReservations: Reservation[] = [];
  upcomingCustomerReservations: Reservation[] = [];
  pastCustomerReservations: Reservation[] = [];
  reservationToUpdate: Reservation;
  users: User[];
  userSelectedForActivation: User;
  userIcon = faUser;
  professionalIcon = faUserTie;
  addedProposedExpertises: FormArray = {} as FormArray;
  servicesProposed: Service[];

  public uploader: FileUploader;
  private title = 'anyTitle';
  serviceForm: FormGroup;
  addIcon = faPlusCircle;
  addableServices: Service[];
  addProfessionalRoleForm: FormGroup;

  constructor(private authService: AuthService,
              private professionalsService: ProfessionalsService,
              private servicesService: ServicesService,
              private reservationsService: ReservationService,
              private customersService: CustomersService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private usersService: UsersService, private router: Router) {
  }

  ngOnInit(): void {
    const loggedInUser = this.authService.getLoggedInUser();
    this.user = loggedInUser.userAccount.user;
    this.servicesService.getServices().subscribe(data => {
      this.services = data as Service[];
    });

    if (loggedInUser.userAccount.customerId > 0) {
      this.customersService.getCustomer(loggedInUser.userAccount.customerId).subscribe(data => {
        this.customer = data as Customer;
        this.upcomingCustomerReservations = this.customer.reservations.filter(r => moment(r.startTime).isAfter(new Date()));
        this.pastCustomerReservations = this.customer.reservations.filter(r => moment(r.startTime).isBefore(new Date()));
      });
    }

    if (loggedInUser.userAccount.professionalId > 0) {
      this.professionalsService.getProfessional(loggedInUser.userAccount.professionalId).subscribe(data => {
        this.professional = data as Professional;
        this.expertiseForm = this.formBuilder.group({
          rate: [0.00, [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]]
        });

        if (this.user.roles.filter(r => r.role.roleName === 'Admin').length === 0) {
          this.reservationsService
            .searchReservation({professionalId: this.professional.id} as ReservationSearchCriteriaDto)
            .subscribe(res => {
              this.upcomingProfessionalReservations = res.filter(r => moment(r.startTime).isAfter(new Date()));
              this.pastProfessionalReservations = res.filter(r => moment(r.startTime).isBefore(new Date()));
            });
        }
      });
    }

    if (this.user.roles.filter(r => r.role.roleName === 'Admin').length > 0) {
      this.reservationsService.getReservations().subscribe(data => {
        this.upcomingReservations = data.filter(r => moment(r.startTime).isAfter(new Date()));
        this.pastReservations = data.filter(r => moment(r.startTime).isBefore(new Date()));
        if (loggedInUser.userAccount.professionalId > 0) {
          this.upcomingProfessionalReservations = this.upcomingReservations
            .filter(r => r.expertise.professionalId === loggedInUser.userAccount.professionalId);
          this.pastProfessionalReservations = this.pastReservations
            .filter(r => r.expertise.professionalId === loggedInUser.userAccount.professionalId);
        }
      });
      this.usersService.getUsers().subscribe(data => {
        this.users = data;
      });
    }

    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.cloud_name}/upload`,
      autoUpload: true,
      isHTML5: true,
      removeAfterUpload: true,
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      form.append('upload_preset', this.cloudinary.upload_preset);
      let tags = 'myphotoalbum';
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `myphotoalbum,${this.title}`;
      }
      form.append('folder', 'angular_sample');
      form.append('tags', tags);
      form.append('file', fileItem);

      fileItem.withCredentials = false;
      return {fileItem, form};
    };

    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.user.picture = JSON.parse(response).url;
      this.usersService.updateUser(this.user).subscribe(data => {
        loggedInUser.userAccount.user = this.user;
        localStorage.setItem('user', JSON.stringify(loggedInUser as LoggedInUser));
      });
    };

    this.serviceForm = this.formBuilder.group({
      titleField: new FormControl(this.selectedServiceForEdit.title, [Validators.required]),
      descriptionField: new FormControl(this.selectedServiceForEdit.description, [Validators.required]),
      categoryField: new FormControl(this.selectedServiceForEdit.category, [Validators.required])
    });
  }

  onClosed(dismissedAlert: Alert): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  getDuration(reservation: Reservation): number {
    return moment(reservation.endTime).diff(reservation.startTime, 'h');
  }

  onSaveExpertise(): void {
    this.expertiseToEdit.hourlyRate = this.expertiseForm.controls.rate.value;
    this.professionalsService.updateExpertise(this.expertiseToEdit).subscribe(() => {
      this.alerts.push({
        type: 'success',
        msg: 'Expertise updated successfully.',
        dismissible: true
      } as Alert);
    }, error => {
      console.log(error);
      this.alerts.push({
        type: 'danger',
        msg: 'Expertise updated failed.',
        dismissible: true
      } as Alert);
    });
    this.modalService.dismissAll();
  }

  onAddExpertise(): void {
    const grantExpertise = {
      professionalId: this.professional.id,
      serviceId: (this.addExpertiseForm.controls.addExpertiseService.value as Service).id,
      hourlyRate: this.addExpertiseForm.controls.addExpertiseRate.value
    } as AddExpertiseToProfessional;
    this.professionalsService.grantExpertise(grantExpertise, this.professional.id).subscribe(data => {
      this.professional = data;
      this.alerts.push({
        type: 'success',
        msg: 'Expertise added successfully.',
        dismissible: true
      } as Alert);
    }, error => {
      console.log(error);
      this.alerts.push({
        type: 'danger',
        msg: 'Adding expertise failed.',
        dismissible: true
      } as Alert);
    });
    this.modalService.dismissAll();
  }

  onEditExpertise(template: TemplateRef<any>, expertise: Expertise): void {
    this.expertiseToEdit = expertise;
    this.expertiseForm = this.formBuilder.group({
      rate: [expertise.hourlyRate, [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), Validators.min(0.0), Validators.required]]
    });
    this.modalService.open(template, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  hasRole(roleName: string): boolean {
    return this.user.roles.filter(r => r.role != null)
      .map(r => r.role.roleName).filter(x => x === roleName).length > 0;
  }

  onSaveService(): void {
    this.selectedServiceForEdit.category = this.serviceForm.controls.categoryField.value;
    this.selectedServiceForEdit.description = this.serviceForm.controls.descriptionField.value;
    this.selectedServiceForEdit.title = this.serviceForm.controls.titleField.value;
    this.modalService.dismissAll();
    if (this.selectedServiceForEdit.id) {
      this.servicesService.updateService(this.selectedServiceForEdit).subscribe(() => {
        this.services.filter(s => s.id === this.selectedServiceForEdit.id)[0] = this.selectedServiceForEdit;
        this.alerts.push({
          type: 'success',
          msg: 'Service updated successfully.',
          dismissible: true
        } as Alert);
      }, error => {
        this.alerts.push({
          type: 'danger',
          msg: 'Service updated failed.',
          dismissible: true
        } as Alert);
      });
    } else {
      this.servicesService.createService(this.selectedServiceForEdit).subscribe(data => {
        this.alerts.push({
          type: 'success',
          msg: 'Service created successfully.',
          dismissible: true
        } as Alert);
        this.services.push(data as Service);
      }, error => {
        this.alerts.push({
          type: 'danger',
          msg: 'Service creation failed.',
          dismissible: true
        } as Alert);
      });
    }
  }

  onDeactivateUser(): void {
    this.userSelectedForActivation.isActive = !this.userSelectedForActivation.isActive;
    this.usersService.updateUser(this.userSelectedForActivation).subscribe(data => {
      this.users.filter(u => u.userId === this.userSelectedForActivation.userId)[0].isActive = this.userSelectedForActivation.isActive;
      this.alerts.push({
        type: 'success',
        msg: 'User updated successfully.',
        dismissible: true
      } as Alert);
    }, error => {
      console.log(error);
      this.alerts.push({
        type: 'danger',
        msg: 'User update failed.',
        dismissible: true
      } as Alert);
    });
    this.modalService.dismissAll();
  }

  editService(serviceTemplate: any, service: Service): void {
    this.selectedServiceForEdit = service;
    this.serviceForm.controls.titleField.setValue(service.title);
    this.serviceForm.controls.descriptionField.setValue(service.description);
    this.serviceForm.controls.categoryField.setValue(service.category);
    this.modalService.open(serviceTemplate, {size: 'lg'});
  }

  showDeleteServiceDialog(serviceTemplate: TemplateRef<any>, service: Service): void {
    this.selectedServiceForEdit = service;
    this.modalService.open(serviceTemplate, {size: 'sm'});
  }

  showUserActivationDialog(userActivationTemplate: TemplateRef<any>, selectedUser: User): void {
    this.userSelectedForActivation = selectedUser;
    this.modalService.open(userActivationTemplate, {size: 'sm'});
  }

  deleteService(): void {
    this.selectedServiceForEdit.isActive = !this.selectedServiceForEdit.isActive;
    this.servicesService.updateService(this.selectedServiceForEdit).subscribe(data => {
      this.services.filter(s => s.id === this.selectedServiceForEdit.id)[0].isActive = this.selectedServiceForEdit.isActive;
      this.alerts.push({
        type: 'success',
        msg: 'Service updated successfully.',
        dismissible: true
      } as Alert);
    }, error => {
      this.alerts.push({
        type: 'danger',
        msg: 'Service update failed.',
        dismissible: true
      } as Alert);
    });
    this.modalService.dismissAll();
  }

  createService(serviceTemplate: TemplateRef<any>): void {
    this.serviceForm.reset({categoryField: Category.INTERIOR});
    this.selectedServiceForEdit = {category: Category.INTERIOR} as Service;
    this.modalService.open(serviceTemplate, {size: 'lg'});
  }

  saveService(): void {

  }

  addCustomerRole(): void {
    const newCustomer = {
      userId: this.user.userId,
      isActive: true
    } as Customer;
    this.customersService.addCustomerRole(newCustomer).subscribe(data => {
      const loggedInUser = this.authService.getLoggedInUser();
      loggedInUser.userAccount.user.roles.push({
        roleId: 1,
        role: {roleName: UserType.CUSTOMER.valueOf(), id: 1} as Role
      } as RoleUser);
      this.customer = data as Customer;
      loggedInUser.userAccount.customerId = this.customer.id;
      this.user = loggedInUser.userAccount.user;
      localStorage.setItem('user', JSON.stringify(loggedInUser as LoggedInUser));
      this.alerts.push({
        type: 'success',
        msg: 'Customer role added successfully.',
        dismissible: true
      } as Alert);
    }, error => {
      console.log(error);
      this.alerts.push({
        type: 'danger',
        msg: 'Adding customer role failed.',
        dismissible: true
      } as Alert);
    });
  }

  addProfessionalRole(): void {
    this.router.navigate(['/become-member']);
  }

  confirmCancelReservation(modalTemplate: TemplateRef<any>, reservation: Reservation): void {
    this.reservationToUpdate = reservation;
    this.modalService.open(modalTemplate, {size: 'sm'});
  }

  cancelReservation(): void {
    this.reservationsService.cancelReservation(this.reservationToUpdate.id).subscribe(data => {
      const upcomingCustomerCancel = this.upcomingCustomerReservations.filter(r => r.id === this.reservationToUpdate.id);
      if (upcomingCustomerCancel.length > 0) {
        this.upcomingCustomerReservations.find(x => x.id === this.reservationToUpdate.id).status = Status.REJECTED;
      }

      const pastCustomerCancel = this.pastCustomerReservations.filter(r => r.id === this.reservationToUpdate.id);
      if (pastCustomerCancel.length > 0) {
        this.pastCustomerReservations.filter(r => r.id === this.reservationToUpdate.id)[0].status = Status.REJECTED;
      }

      const upcomingProfessionalCancel = this.upcomingProfessionalReservations.filter(r => r.id === this.reservationToUpdate.id);
      if (upcomingProfessionalCancel.length > 0) {
        this.upcomingProfessionalReservations.filter(r => r.id === this.reservationToUpdate.id)[0].status = Status.REJECTED;
      }

      const pastProfessionalCancel = this.pastProfessionalReservations.filter(r => r.id === this.reservationToUpdate.id);
      if (pastProfessionalCancel.length > 0) {
        this.pastProfessionalReservations.filter(r => r.id === this.reservationToUpdate.id)[0].status = Status.REJECTED;
      }

      this.alerts.push({
        type: 'success',
        msg: 'Reservation cancelled successfully.',
        dismissible: true
      } as Alert);
    }, error => {
      console.log(error);
      this.alerts.push({
        type: 'danger',
        msg: 'Reservation cancellation failed.',
        dismissible: true
      } as Alert);
    });
    this.modalService.dismissAll();
  }

  showAddExpertiseModal(addExpertiseTemplate: TemplateRef<any>): void {
    this.addableServices = this.services
      .filter(s => !_.contains(this.professional.expertises.map(e => e.service.id), s.id));
    this.addExpertiseForm = this.formBuilder.group({
      addExpertiseService: new FormControl(this.addableServices[0]),
      addExpertiseRate: new FormControl(0.0, [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), Validators.min(0.0), Validators.required])
    });
    this.modalService.open(addExpertiseTemplate, {size: 'lg'});
  }

  getRecurrenceName(label: Label): string {
    switch (label) {
      case Label.DAILY:
        return 'Daily';
      case Label.WEEKLY:
        return 'Weekly';
      default:
        return 'Once';
    }
  }

  showAddProfessionalRoleModal(addProfessionalRoleTemplate: TemplateRef<any>): void {
    this.servicesProposed = [];
    this.servicesProposed.push(this.services[0]);
    this.services = this.services.filter(s => !_.contains(this.servicesProposed, s));
    this.addedProposedExpertises = new FormArray([
      new FormGroup({
        proposedService: new FormControl(this.servicesProposed[0]),
        proposedHourlyRate: new FormControl(0.00, [Validators.required, Validators.min(1)])
      })
    ], [Validators.required]);
    this.addProfessionalRoleForm = this.formBuilder.group({
      proposedExpertises: this.addedProposedExpertises
    });
    // this.modalService.open(addProfessionalRoleTemplate, {size: 'lg'});
  }

  removeProposedService(i: number): void {
    const grpToRemove = this.addedProposedExpertises.controls[i] as FormGroup;
    this.servicesProposed.push(grpToRemove.controls.proposedService.value as Service);
    this.addedProposedExpertises.removeAt(i);
  }

  addProposedService(): void {
    const addedServiceCtr = _.last(this.addedProposedExpertises.controls) as FormGroup;
    const addedService = addedServiceCtr.controls.proposedService.value as Service;
    this.servicesProposed.push(addedService);
    console.log(this.servicesProposed);
    this.services = this.services.filter(s => !_.contains(this.servicesProposed, s));
    this.addedProposedExpertises.insert(this.addedProposedExpertises.length, new FormGroup({
      proposedService: new FormControl(this.servicesProposed[0]),
      proposedHourlyRate: new FormControl(0.00, [Validators.required, Validators.min(1)])
    }));
    this.services = this.services.filter(s => !_.contains(this.servicesProposed, s));
  }
}
