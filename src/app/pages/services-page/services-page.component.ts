import {Component, OnInit} from '@angular/core';
import {Category, Service} from '../../+models/service';
import {ServicesService} from '../../+services/services.service';

@Component({
  selector: 'app-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss']
})
export class ServicesPageComponent implements OnInit {

  services: Service[];
  interiorServices: Service[];
  exteriorServices: Service[];
  alerts: any[] = [];

  constructor(private servicesService: ServicesService) {
  }

  ngOnInit(): void {
    this.servicesService.getServices().subscribe(data => {
      this.services = data.filter(s => s.isActive);
      this.exteriorServices = this.services.filter(d => d.category === Category.EXTERIOR);
      this.interiorServices = this.services.filter(d => d.category === Category.INTERIOR);
    }, () => {
      this.alerts.push({
        type: 'danger',
        msg: 'Error retrieving data',
        dismissible: true
      });
    });
  }

}
