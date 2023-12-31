import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private resposeTime: number = 2; // In seconds

  private stepOneValue: any[];

  private verificationCode: string;

  private stepTwoValue: any[];

  constructor() {}

  public registrationStepOne(data: any[]): Observable<boolean> {
    return new Observable((observer) => {
      setTimeout(() => {
        this.stepOneValue = data;
        observer.next(true);
      }, this.resposeTime * 1000);
    });
  }

  public registrationStepTwo(data: any[]): Observable<boolean> {
    return new Observable((observer) => {
      console.log(data);
      setTimeout(() => {
        this.stepTwoValue = data;
        observer.next(true);
      }, this.resposeTime * 1000);
    });
  }

  public checkVerificationCode(code: string): Observable<boolean> {
    return new Observable((observer) => {
      setTimeout(() => {
        if (code.match(/^[0-9]{4}$/)) {
          observer.next(true);
          this.verificationCode = code;
        } else {
          observer.next(false);
        }
      }, this.resposeTime * 1000);
    });
  }
}
