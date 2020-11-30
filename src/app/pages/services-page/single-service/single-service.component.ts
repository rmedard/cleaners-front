import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Service} from '../../../+models/service';
import {Expertise} from '../../../+models/expertise';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {faCalendarAlt, faLongArrowAltDown, faLongArrowAltUp, faSearch} from '@fortawesome/free-solid-svg-icons';
import {LabelType, Options} from 'ng5-slider';
import {
  AvailableExpertiseSearch,
  AvailableExpertiseSearchDto,
  Order
} from '../../../+models/dto/available-expertise-search-dto';
import {ProfessionalsService} from '../../../+services/professionals.service';
import {SimpleDateStringPipe} from '../../../+utils/simple-date-string.pipe';
import {NgbDate, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import {Reservation} from '../../../+models/reservation';
import {AuthService} from '../../../+services/auth.service';
import {ReservationForCreate} from '../../../+models/dto/reservation-for-create';
import {ReservationService} from '../../../+services/reservation.service';
import {Alert} from '../../../+models/dto/alert';
import {Label, Recurrence} from '../../../+models/recurrence';

@Component({
  selector: 'app-single-service',
  templateUrl: './single-service.component.html',
  styleUrls: ['./single-service.component.scss']
})
export class SingleServiceComponent implements OnInit {

  service: Service;
  expertises: Expertise[] = [];
  filterForm: FormGroup;
  calendarIcon = faCalendarAlt;
  descIcon = faLongArrowAltDown;
  ascIcon = faLongArrowAltUp;
  searchIcon = faSearch;
  startHour: number;
  endHour: number;
  options: Options = {};
  availableExpertises = {} as AvailableExpertiseSearchDto;
  reservation: Reservation = {} as Reservation;
  alerts: Alert[] = [];
  recurrence: string;
  isCustomer = true;

  constructor(private route: ActivatedRoute,
              private professionalsService: ProfessionalsService,
              private formBuilder: FormBuilder,
              private dateFormatter: SimpleDateStringPipe,
              private modalService: NgbModal,
              private authService: AuthService,
              private reservationsService: ReservationService) {
  }

  ngOnInit(): void {
    this.isCustomer = this.authService.getLoggedInUser()
      .userAccount.user.roles.map(r => r.role.roleName)
      .filter(n => n === 'Customer').length > 0;
    this.recurrence = 'n';
    this.options = this.sliderOptions(new Date());
    this.startHour = this.options.floor;
    this.endHour = this.options.floor + 1;
    this.filterForm = this.formBuilder.group({
      serviceDateField: [this.getNgbMinSelectableDate(), Validators.required],
      serviceHourRange: new FormControl([this.startHour, this.endHour], Validators.required),
      sorting: [Order.DESC.valueOf(), Validators.required]
    });

    this.route.data.subscribe(data => {
      this.service = data.service;
      this.availableExpertises.serviceId = this.service.id;
      this.availableExpertises.dateTime = this.dateFormatter.transform(this.getMinSelectableDate());
      this.availableExpertises.duration = this.endHour - this.startHour;
      this.availableExpertises.order = Order.DESC;
      this.professionalsService.getAvailable(this.availableExpertises).subscribe(expertises => {
        this.expertises = expertises;
      });
    });
  }

  getMinSelectableDate(): Date {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    if (today.getHours() >= environment.workingHourMax - 1) {
      return moment(today).add(1, 'd').hours(environment.workingHourMin).toDate();
    }
    return moment(today).add(1, 'h').toDate();
  }

  getNgbMinSelectableDate(): NgbDateStruct {
    return {
      year: this.getMinSelectableDate().getFullYear(),
      month: this.getMinSelectableDate().getMonth() + 1,
      day: this.getMinSelectableDate().getDate()
    } as NgbDateStruct;
  }

  findExpertises(): void {
    const searchDto = new AvailableExpertiseSearch(this.filterForm, this.dateFormatter, this.service.id);
    this.professionalsService.getAvailable(searchDto).subscribe(expertises => {
      this.expertises = expertises;
    });
  }

  private sliderOptions(date: Date): Options {
    const options = {
      floor: this.getMinSelectableDate().getHours(),
      ceil: environment.workingHourMax,
      minRange: 1,
      showTicks: true,
      getPointerColor: (): string => {
        return '#212529';
      },
      getSelectionBarColor: (): string => {
        return '#212529';
      },
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '<b>De</b> ' + value + ':00';
          case LabelType.High:
            return '<b>À</b> ' + value + ':00';
          default:
            return value + ':00';
        }
      }
    } as Options;

    if (!moment(date).isSame(moment().toDate(), 'd')) {
      options.floor = environment.workingHourMin;
    }
    return options;
  }

  serviceDateChanged($event: NgbDate): void {
    const jsDate = new Date($event.year, $event.month - 1, $event.day);
    this.options = this.sliderOptions(jsDate);
  }

  order(content: any, selectedExpertise: Expertise): void {
    const serviceNgbDate = this.filterForm.controls.serviceDateField.value as NgbDate;
    const serviceDate = new Date(serviceNgbDate.year, serviceNgbDate.month, serviceNgbDate.day);
    const range = this.filterForm.controls.serviceHourRange.value as Array<number>;
    this.reservation = {
      startTime: moment(serviceDate).hours(range[0]).seconds(0).toDate(),
      endTime: moment(serviceDate).hours(range[1]).seconds(0).toDate(),
      expertise: selectedExpertise,
      customerId: this.authService.getLoggedInUser().userAccount.customerId,
      totalCost: selectedExpertise.hourlyRate * (range[1] - range[0])
    } as Reservation;
    this.modalService.open(content, {size: 'lg'});
  }

  sendOrder(): void {
    const range = this.filterForm.controls.serviceHourRange.value as Array<number>;
    const reservationForCreate = {
      customerId: this.authService.getLoggedInUser().userAccount.customerId,
      expertiseForServiceCreate: {
        professionalId: this.reservation.expertise.professionalId,
        serviceId: this.service.id
      },
      startTime: this.reservation.startTime,
      duration: range[1] - range[0]
    } as ReservationForCreate;
    if (this.recurrence !== 'n') {
      reservationForCreate.recurrence = {
        label: this.recurrence,
        isActive: true,
      } as Recurrence;
    }
    this.reservationsService.createOrder(reservationForCreate).subscribe(data => {
      console.log(data);
      this.alerts.push({
        type: 'success',
        msg: 'Votre reservation est bien créée!!',
        dismissible: true
      } as Alert);
    }, error => {
      this.alerts.push({
        type: 'danger',
        msg: `La création do votre reservation a échouée: ${error.error}`,
        dismissible: true
      } as Alert);
    }, () => {
      this.modalService.dismissAll();
    });
  }

  onClosed(dismissedAlert: Alert): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
