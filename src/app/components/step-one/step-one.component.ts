import {
  Component,
  HostListener,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { VerificationComponent } from '../verification/verification.component';
import { Router } from '@angular/router';

interface Quote {
  auther: string;
  autherTitle: string;
  content: string;
}

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent {
  @ViewChild('verificationCodeDialogContainer', {
    static: true,
    read: ViewContainerRef,
  })
  public verificationCodeDialogContainer!: ViewContainerRef;

  public isShownPassword: boolean = false;

  public stepOneForm: FormGroup;

  public validationChecked: boolean = false;

  public sendingCode: boolean = false;

  public quotes: Quote[] = [
    {
      auther: 'Salma Mohamed',
      autherTitle: 'Founder, Soliter Salon',
      content:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    },
    {
      auther: 'Walaa Ossama',
      autherTitle: 'Owner, Golden Salon',
      content:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    },
    {
      auther: 'Omnia Ahmed',
      autherTitle: 'G.M., Princesses Salon',
      content:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    },
  ];

  @HostListener('document:keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      this.verificationCodeDialogContainer?.clear();
    }
  }

  public constructor(private authService: AuthService, private router: Router) {
    this.stepOneForm = new FormGroup({
      first_name: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
      ]),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Zs]+'),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{8,13}'),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9a-zA-Z!@#$%^&*()]{8,}'),
      ]),
      policy_agreement: new FormControl(null, [
        Validators.required,
        Validators.pattern('true'),
      ]),
    });
  }

  private showVerificationCodeDialog() {
    const verificationComponent =
      this.verificationCodeDialogContainer.createComponent(
        VerificationComponent
      );

    verificationComponent.instance.phoneNumber =
      this.stepOneForm.get('phone').value;

    verificationComponent.instance.close.subscribe((isClosed: boolean) => {
      if (isClosed) {
        verificationComponent.destroy();
      }
    });

    verificationComponent.instance.validateCode.subscribe((isValidCode) => {
      if (isValidCode) {
        this.router.navigate(['step-two']);
      } else {
        // faild verification code
      }
    });
  }

  public submit(): void {
    this.validationChecked = true;
    if (this.stepOneForm.valid) {
      this.sendingCode = true;
      this.authService
        .registrationStepOne(this.stepOneForm.value)
        .subscribe((response) => {
          if (response === true) {
            this.sendingCode = false;
            this.showVerificationCodeDialog();
          } else {
            // failed step one
          }
        });
    }
  }

  public hasError(inputName: string, validator: string): boolean {
    return (
      (this.validationChecked || this.stepOneForm.get(inputName).touched) &&
      (this.stepOneForm.get(inputName).hasError('required') ||
        this.stepOneForm.get(inputName).hasError(validator))
    );
  }
}
