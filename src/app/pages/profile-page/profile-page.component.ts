import {Component, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from '../../+services/auth.service';
import {User} from '../../+models/user';
import {Customer} from '../../+models/customer';
import {Professional} from '../../+models/professional';
import {ProfessionalsService} from '../../+services/professionals.service';
import {CustomersService} from '../../+services/customers.service';
import {Alert} from '../../+models/dto/alert';
import * as moment from 'moment';
import {Reservation} from '../../+models/reservation';
import {faEuroSign} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ServicesService} from '../../+services/services.service';
import {Service} from '../../+models/service';
import {Expertise} from '../../+models/expertise';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
  closeResult = '';

  constructor(private authService: AuthService,
              private professionalsService: ProfessionalsService,
              private servicesService: ServicesService,
              private customersService: CustomersService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    const loggedInUser = this.authService.getLoggedInUser();
    this.user = loggedInUser.userAccount.user;
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
      this.servicesService.getServices().subscribe(data => {
        this.services = data as Service[];
      });
    }
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

  openModal(editMode: boolean, template: TemplateRef<any>, expertise: Expertise): void {
    // this.expertiseForm.controls['editMode'].setValue(editMode);
    // this.dropDownProfessions = this.professions;
    // this.selectedExpertise = expertise;
    // if (editMode) {
    //   this.expertiseForm.controls['professionId'].setValue(expertise.profession.id);
    //   this.expertiseForm.controls['rate'].setValue(expertise.unitPrice);
    //   this.expertiseForm.controls['professionId'].disable();
    // } else {
    //   // Remove already owned professions
    //   this.dropDownProfessions = _.filter(this.professions, data => {
    //     return !_.findWhere(_.map(this.professional.expertises, function (data1) {
    //       return data1.profession;
    //     }), data);
    //   });
    // }
    // this.expertiseModalRef = this.modalService.show(expertiseTemplate);
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
}
