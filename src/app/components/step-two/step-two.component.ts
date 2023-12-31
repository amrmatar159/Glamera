import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface Place {
  id: string;
  name: string;
  icon: string;
}

interface BusinessType {
  name: string;
  checkedImg: string;
  uncheckedImg: string;
}

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
})
export class StepTwoComponent {
  public validationChecked: boolean = false;

  public isSubmiting: boolean = false;

  public stepTwoForm: FormGroup;

  public businessType: BusinessType[] = [
    {
      name: 'Salon',
      checkedImg: 'assets/img/scissor-c.svg',
      uncheckedImg: 'assets/img/scissor.svg',
    },
    {
      name: 'Gym',
      checkedImg: 'assets/img/gym-c.svg',
      uncheckedImg: 'assets/img/gym.svg',
    },
    {
      name: 'Spa',
      checkedImg: 'assets/img/spa-c.svg',
      uncheckedImg: 'assets/img/spa.svg',
    },
    {
      name: 'Clinic',
      checkedImg: 'assets/img/clinic-c.svg',
      uncheckedImg: 'assets/img/clinic.svg',
    },
  ];

  public PlaceList: Place[] = [
    { id: 'facebook', name: 'FaceBook', icon: 'fab fa-facebook-f' },
    { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter' },
    { id: 'friend', name: 'Friend', icon: 'fas fa-user' },
  ];

  public constructor(private authService: AuthService, private router: Router) {
    this.stepTwoForm = new FormGroup({
      business_name: new FormControl(null, Validators.required),
      business_type: new FormArray(
        [...Array(4).keys()].map(
          () => new FormControl(null, [Validators.pattern('true')])
        ),
        [Validators.required, Validators.minLength(1)]
      ),
      governorate: new FormControl(null, Validators.required),
      district: new FormControl(null, Validators.required),
      place: new FormControl(null, Validators.required),
      using_system: new FormControl(null, Validators.required),
    });
  }

  public submit(): void {
    this.validationChecked = true;
    const businessType = (
      this.stepTwoForm.get('business_type') as FormArray
    ).controls
      .map((control) => control.value)
      .map((v, i) => (v === true ? this.businessType[i]?.name : null))
      .filter((x) => x !== null);
    if (businessType.length === 0) {
      this.stepTwoForm.get('business_type').setErrors({ minLength: true });
    }
    if (this.stepTwoForm.valid) {
      this.isSubmiting = true;
      this.authService
        .registrationStepTwo({
          ...this.stepTwoForm.value,
          business_type: businessType,
        })
        .subscribe((response) => {
          if (response === true) {
            this.isSubmiting = false;
            this.router.navigate(['complete']);
          } else {
            // failed step two
          }
        });
    }
  }

  public hasError(inputName: string): boolean {
    return (
      (this.validationChecked || this.stepTwoForm.get(inputName).touched) &&
      this.stepTwoForm.get(inputName).invalid
    );
  }
}
