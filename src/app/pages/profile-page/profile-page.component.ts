import {Component, NgZone, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from '../../+services/auth.service';
import {User} from '../../+models/user';
import {Customer} from '../../+models/customer';
import {Professional} from '../../+models/professional';
import {ProfessionalsService} from '../../+services/professionals.service';
import {CustomersService} from '../../+services/customers.service';
import {Alert} from '../../+models/dto/alert';
import * as moment from 'moment';
import {Reservation} from '../../+models/reservation';
import {faEuroSign, faPlus, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ServicesService} from '../../+services/services.service';
import {Service} from '../../+models/service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileUploader, FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import CloudinaryConfiguration from '@cloudinary/angular-5.x/lib/cloudinary-configuration.class';
import {UsersService} from '../../+services/users.service';
import {LoggedInUser} from '../../+models/dto/logged-in-user';

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
  expertiseForm: FormGroup;
  services: Service[];
  selectedServiceForEdit: Service = {} as Service;
  closeResult = '';
  cloudinary = environment.cloudinaryConfig as CloudinaryConfiguration;

  private hasBaseDropZoneOver = false;
  public uploader: FileUploader;
  private title = 'anyTitle';
  serviceForm: FormGroup;
  addIcon = faPlusCircle;

  constructor(private authService: AuthService,
              private professionalsService: ProfessionalsService,
              private servicesService: ServicesService,
              private customersService: CustomersService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private usersService: UsersService) {
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
      });
    }
    if (loggedInUser.userAccount.professionalId > 0) {
      this.professionalsService.getProfessional(loggedInUser.userAccount.professionalId).subscribe(data => {
        this.professional = data as Professional;
        this.expertiseForm = this.formBuilder.group({
          editMode: [false],
          professionalId: [this.professional.id],
          professionId: [null, Validators.required],
          rate: [0.00, [Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]]
        });
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
  }

  onClosed(dismissedAlert: Alert): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  getDuration(reservation: Reservation): number {
    return moment(reservation.endTime).diff(reservation.startTime, 'h');
  }

  onSaveExpertise(): void {
    console.log('Save expertise called...');
  }

  open(template: TemplateRef<any>): void {
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
    return this.user.roles.map(r => r.role.roleName).filter(x => x === roleName).length > 0;
  }

  onSaveService(): void {

  }

  editService(serviceTemplate: any, service: Service): void {
    this.selectedServiceForEdit = service;
    this.serviceForm = this.formBuilder.group({
      titleField: new FormControl(this.selectedServiceForEdit.title, [Validators.required]),
      descriptionField: new FormControl(this.selectedServiceForEdit.category),
      categoryField: new FormControl(this.selectedServiceForEdit.category, [Validators.required])
    });
    this.modalService.open(serviceTemplate, {size: 'sm'});
  }

  deleteService(serviceTemplate: TemplateRef<any>, service: Service): void {

  }
}
