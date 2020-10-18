import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Service} from '../../../+models/service';
import {Expertise} from '../../../+models/expertise';
import {FormBuilder, FormGroup} from '@angular/forms';
import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import {LabelType, Options, PointerType} from 'ng5-slider';
import {GetAvailableExpertises} from '../../../+models/dto/get-available-expertises';
import {ProfessionalsService} from '../../../+services/professionals.service';
import {SimpleDateStringPipe} from '../../../+utils/simple-date-string.pipe';

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
  startHour = 8;
  endHour = 18;
  serviceDate: Date;
  options: Options = {
    floor: 8, ceil: 18, minRange: 1, showTicks: true,
    getPointerColor: (value: number, pointer: PointerType): string => {
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
    this.serviceDate = new Date();
    this.serviceDate.setMinutes(0);
    this.serviceDate.setSeconds(0);

    this.filterForm = this.formBuilder.group({
      serviceDateField: [this.serviceDate]
    });

    this.route.data.subscribe(data => {
      this.service = data.service;
      this.availableExpertises.serviceId = this.service.id;
      this.availableExpertises.dateTime = this.dateFormatter.transform(this.serviceDate);
      this.availableExpertises.duration = this.endHour - this.startHour;
      console.log(this.availableExpertises);
      this.professionalsService.getAvailableProfessionals(this.availableExpertises).subscribe(expertises => {
        this.expertises = expertises;
      });
    });
  }

}
