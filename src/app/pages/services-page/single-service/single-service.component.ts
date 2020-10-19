import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Service} from '../../../+models/service';
import {Expertise} from '../../../+models/expertise';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {faCalendarAlt, faLongArrowAltDown, faLongArrowAltUp, faSearch} from '@fortawesome/free-solid-svg-icons';
import {LabelType, Options} from 'ng5-slider';
import {GetAvailableExpertises} from '../../../+models/dto/get-available-expertises';
import {ProfessionalsService} from '../../../+services/professionals.service';
import {SimpleDateStringPipe} from '../../../+utils/simple-date-string.pipe';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

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
  startHour = 9;
  endHour = 10;
  options: Options = {
    floor: 8, ceil: 18, minRange: 1, showTicks: true,
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
  };
  availableExpertises = {} as GetAvailableExpertises;

  constructor(private route: ActivatedRoute,
              private professionalsService: ProfessionalsService,
              private formBuilder: FormBuilder,
              private dateFormatter: SimpleDateStringPipe) {
  }

  ngOnInit(): void {

    this.filterForm = this.formBuilder.group({
      serviceDateField: [this.getNgbMinSelectableDate(), Validators.required],
      serviceHourRange: new FormControl([this.startHour, this.endHour], Validators.required),
      sorting: ['desc', Validators.required]
    });

    this.route.data.subscribe(data => {
      this.service = data.service;
      this.availableExpertises.serviceId = this.service.id;
      this.availableExpertises.dateTime = this.dateFormatter.transform(this.getMinSelectableDate());
      this.availableExpertises.duration = this.endHour - this.startHour;
      this.professionalsService.getAvailableExpertises(this.availableExpertises).subscribe(expertises => {
        if (this.filterForm.controls.sorting.value === 'desc') {
          this.expertises = expertises.sort((e1, e2) => e2.hourlyRate - e1.hourlyRate);
        } else {
          this.expertises = expertises.sort((e1, e2) => e1.hourlyRate - e2.hourlyRate);
        }
      });
    });
  }

  getMinSelectableDate(): Date {
    const today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    return today.getHours() >= 17 ? moment(today).add(1, 'd').toDate() : today;
  }

  getNgbMinSelectableDate(): NgbDateStruct {
    return {
      year: this.getMinSelectableDate().getFullYear(),
      month: this.getMinSelectableDate().getMonth() + 1,
      day: this.getMinSelectableDate().getDate()
    } as NgbDateStruct;
  }

  findExpertises(): void {
    this.professionalsService.getAvailableExpertises(this.formModelToAvailableExpertises()).subscribe(expertises => {
      if (this.filterForm.controls.sorting.value === 'desc') {
        this.expertises = expertises.sort((e1, e2) => e2.hourlyRate - e1.hourlyRate);
      } else {
        this.expertises = expertises.sort((e1, e2) => e1.hourlyRate - e2.hourlyRate);
      }
    });
  }

  formModelToAvailableExpertises(): GetAvailableExpertises {
    const availableExpertisesModel = this.filterForm.value;
    const ngbServiceDateStruct = availableExpertisesModel.serviceDateField;
    const serviceDate = moment(`${ngbServiceDateStruct.day}-${ngbServiceDateStruct.month}-${ngbServiceDateStruct.year}`, 'DD-MM-YYYY')
      .hours(availableExpertisesModel.serviceHourRange[0])
      .toDate();
    return {
      dateTime: this.dateFormatter.transform(serviceDate),
      duration: availableExpertisesModel.serviceHourRange[1] - availableExpertisesModel.serviceHourRange[0],
      serviceId: this.service.id
    } as GetAvailableExpertises;
  }
}
