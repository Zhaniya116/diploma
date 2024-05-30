import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProfileService } from '../profile.service';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private profileService: ProfileService, private authService: AuthService, private oauthService: OAuthService) { }

  private configureOAuth(): void {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      redirectUri: window.location.origin,
      clientId: '188921064115-pujs7fg1nivum53nnf2e1iokjt6d2487.apps.googleusercontent.com',
      scope: 'openid profile email https://www.googleapis.com/auth/calendar',
      strictDiscoveryDocumentValidation: false
    };
  
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLoginImplicitFlow().then(() => {
        if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initLoginFlow();
        } else {
          this.oauthService.loadUserProfile().then( (userProfile) => {
            console.log(JSON.stringify(userProfile))
          })
        }
      })
      
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.message = params['message'] || '';
    });

    if (this.isAuthenticated() && !this.oauthService.hasValidAccessToken()) {
      this.configureOAuth();
    }
  }

  isAuthenticated(): boolean {
    return this.profileService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  goToLoginPage(): void {
    this.router.navigate(['/login']);
  }

  goToRegisterPage(): void {
    this.router.navigate(['/register']);
  }

  goToDoctors(): void {
    this.router.navigate(['/doctors']);
  }

  goToServices(): void {
    this.router.navigate(['/services']);
  }
  goToProfilePage(): void {
    this.router.navigate(['/my-profile'])
  }

  goToMyAppointments(): void {
    this.router.navigate(['/my-appointments'])
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToBooking(): void {
    this.router.navigate(['/doctors']);
  }

  goToOffers(): void {
    this.router.navigate(['/services']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

}
