import {Routes} from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {ServicesPageComponent} from './pages/services-page/services-page.component';
import {ContactPageComponent} from './pages/contact-page/contact-page.component';
import {BecomeMemberPageComponent} from './pages/become-member-page/become-member-page.component';
import {SingleServiceComponent} from './pages/services-page/single-service/single-service.component';
import {ServiceResolver} from './+resolvers/service-resolver';

export const appRoutes: Routes = [
  {path: '', redirectTo: 'home-page', pathMatch: 'full'},
  {path: 'home', component: HomePageComponent},
  {path: 'services', component: ServicesPageComponent},
  {path: 'become-member', component: BecomeMemberPageComponent},
  {path: 'contact', component: ContactPageComponent},
  {path: 'services/:id', component: SingleServiceComponent, resolve: {service: ServiceResolver}},
  {path: '**', component: HomePageComponent}
];
