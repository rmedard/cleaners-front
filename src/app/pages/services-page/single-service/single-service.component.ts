import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Service} from '../../../+models/service';
import {Expertise} from '../../../+models/expertise';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {faCalendarAlt, faLongArrowAltDown, faLongArrowAltUp, faSearch} from '@fortawesome/free-solid-svg-icons';
import {LabelType, Options} from 'ng5-slider';
import {
  AvailableExpertiseSearchDto,
  AvailableExpertisesSearch
} from '../../../+models/dto/available-expertise-search-dto';
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
  startHour = 8;
  endHour = 10;
  options: Options = {};
  availableExpertises = {} as AvailableExpertiseSearchDto;

  constructor(private route: ActivatedRoute,
              private professionalsService: ProfessionalsService,
              private formBuilder: FormBuilder,
              private dateFormatter: SimpleDateStringPipe) {
  }

  ngOnInit(): void {
    this.options = this.getSliderOptions();
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
      this.professionalsService.getAvailable(this.availableExpertises).subscribe(expertises => {
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
    if (today.getHours() >= 17) {
      return moment(today).add(1, 'd').hours(8).toDate();
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
    const searchDto = new AvailableExpertisesSearch(this.filterForm, this.dateFormatter, this.service.id);
    this.professionalsService.getAvailable(searchDto).subscribe(expertises => {
      if (this.filterForm.controls.sorting.value === 'desc') {
        this.expertises = expertises.sort((e1, e2) => e2.hourlyRate - e1.hourlyRate);
      } else {
        this.expertises = expertises.sort((e1, e2) => e1.hourlyRate - e2.hourlyRate);
      }
    });
  }

  getSliderOptions(): Options {
    return {
      floor: this.getMinSelectableDate().getHours(),
      ceil: 18,
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
  }
}
