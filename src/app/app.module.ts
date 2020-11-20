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
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EllipsisPipe} from './+utils/ellipsis-pipe';
import {SingleServiceComponent} from './pages/services-page/single-service/single-service.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng5SliderModule} from 'ng5-slider';
import {SimpleDateStringPipe} from './+utils/simple-date-string.pipe';
import {JwtModule} from '@auth0/angular-jwt';
import {ProfilePageComponent} from './pages/profile-page/profile-page.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AuthInterceptorService} from './+interceptors/auth-interceptor.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    ReactiveFormsModule, BrowserAnimationsModule, NgbModule, Ng5SliderModule, JwtModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }, defaultLanguage: 'fr'
    })
  ],
  providers: [SimpleDateStringPipe, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
