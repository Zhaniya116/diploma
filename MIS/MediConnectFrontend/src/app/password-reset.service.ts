import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  requestPasswordReset(email: string, securityAnswer: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/password-reset-request/`, { email, security_answer: securityAnswer });
  }

  resetPassword(email: string, newPassword: string, securityAnswer: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/password-reset/`, { email, new_password: newPassword, security_answer: securityAnswer });
  }
}
