import {Component, OnInit} from '@angular/core';
import {Alert} from '../../+models/dto/alert';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../+services/auth.service';
import {Email} from '../../+models/email';
import {EmailsService} from '../../+services/emails.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {

  alerts: Alert[] = [];
  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private emailService: EmailsService) {
  }

  ngOnInit(): void {
    const user = this.authService.loggedIn() ? this.authService.getLoggedInUser().userAccount.user : null;
    this.contactForm = this.formBuilder.group({
      replyTo: [this.authService.loggedIn() ? user.email : '', [Validators.required, Validators.email]],
      senderNames: [this.authService.loggedIn() ? `${user.lastName} ${user.firstName}` : '', Validators.required],
      body: ['', Validators.required],
    });
  }

  onClosed(dismissedAlert: Alert): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  onSendContactMessage(): void {
    const email = {
      to: 'app_email@mail.com',
      replyTo: this.contactForm.controls.replyTo.value,
      body: this.contactForm.controls.body.value,
      subject: 'Contact Email',
    } as Email;
    this.emailService.sendEmail(email).subscribe(
      () => {
        this.contactForm.reset();
        this.alerts.push({
          type: 'success',
          msg: 'Your message has been sent successfully',
          dismissible: true
        });
      }, () => {
        this.alerts.push({
          type: 'danger',
          msg: 'Sending email failed...',
          dismissible: true
        });
      }
    );
  }
}
