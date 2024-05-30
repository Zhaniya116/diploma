import { Component } from '@angular/core';
import { PasswordResetService } from '../password-reset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css']
})
export class RequestPasswordResetComponent {
  email: string = '';
  securityAnswer: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private passwordResetService: PasswordResetService, private router: Router) {}

  requestReset() {
    this.passwordResetService.requestPasswordReset(this.email, this.securityAnswer).subscribe(
      response => {
        this.successMessage = 'Security answer is correct. Proceed to reset password.';
        this.router.navigate(['/reset-password'], { state: { email: this.email, securityAnswer: this.securityAnswer } });
      },
      error => {
        this.errorMessage = 'Invalid security answer or email.';
      }
    );
  }
}
