import { Component } from '@angular/core';
import { PasswordResetService } from '../password-reset.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  email: string='';
  newPassword: string='';
  securityAnswer: string='';
  errorMessage: string='';
  successMessage: string='';

  constructor(private passwordResetService: PasswordResetService, private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { email: string, securityAnswer: string };
    if (state) {
      this.email = state.email;
      this.securityAnswer = state.securityAnswer;
    }
  }

  resetPassword() {
    this.passwordResetService.resetPassword(this.email, this.newPassword, this.securityAnswer).subscribe(
      response => {
        this.successMessage = 'Password has been reset successfully.';
        this.router.navigate(['/login']);
      },
      error => {
        this.errorMessage = 'Failed to reset password. Please check your details.';
      }
    );
  }
}
