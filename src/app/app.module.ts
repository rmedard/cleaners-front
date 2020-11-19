import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {NavigationBarComponent} from './pages/layout/navigation-bar/navigation-bar.component';
import {FooterComponent} from './pages/layout/footer/footer.component';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {appRoutes} from './routes';
import {ServicesPageComponent} from './pages/services-page/services-page.component';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {ContactPageComponent} from './pages/contact-page/contact-page.component';
import {AuthPageComponent} from './pages/auth-page/auth-page.component';
import {BecomeMemberPageComponent} from './pages/become-member-page/become-member-page.component';
import {HttpClientModule} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EllipsisPipe} from './+utils/ellipsis-pipe';
import {SingleServiceComponent} from './pages/services-page/single-service/single-service.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng5SliderModule} from 'ng5-slider';
import {SimpleDateStringPipe} from './+utils/simple-date-string.pipe';
import {JwtModule} from '@auth0/angular-jwt';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavigationBarComponent,
    FooterComponent,
    ServicesPageComponent,
    HomePageComponent,
    ContactPageComponent,
    AuthPageComponent,
    BecomeMemberPageComponent,
    EllipsisPipe,
    SingleServiceComponent,
    SimpleDateStringPipe,
    ProfilePageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    CarouselModule, HttpClientModule, FontAwesomeModule,
    ReactiveFormsModule, BrowserAnimationsModule, NgbModule, Ng5SliderModule, JwtModule
  ],
  providers: [SimpleDateStringPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
