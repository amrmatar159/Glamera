import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['verification.component.scss'],
})
export class VerificationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('input')
  private inputs: QueryList<ElementRef>;

  @ViewChild('submitButton')
  private submitButton: ElementRef;

  @Input()
  public phoneNumber: 'string';

  @Output()
  public validateCode = new BehaviorSubject<boolean>(null);

  @Output()
  public close = new BehaviorSubject<boolean>(false);

  public verificationForm: FormGroup;

  public isCheckingCode: boolean = false;

  public validationChecked: boolean = false;

  public countDown: number = 180;

  private counterInterval;

  @HostListener('document:keyup', ['$event'])
  public onKeyup(event: KeyboardEvent): void {
    const numberKeys = [...Array(10).keys()].map((n) => n.toString());
    if (numberKeys.includes(event.key)) {
      const inputListCount = this.inputs.toArray().length;
      const inputIndex = this.inputs
        .toArray()
        .findIndex((x) => x.nativeElement === event.target);
      if (inputIndex >= 0 && inputIndex + 1 <= inputListCount) {
        this.onFocus(inputIndex + 1);
      }
    }
  }

  public constructor(private authService: AuthService) {
    this.verificationForm = new FormGroup({
      code: new FormArray(
        [...Array(4).keys()].map(
          () =>
            new FormControl(null, [
              Validators.required,
              Validators.pattern('[0-9]'),
            ])
        ),
        [Validators.required]
      ),
    });
  }

  public ngOnInit(): void {
    this.counterInterval = setInterval(() => {
      this.countDown -= 1;
      if (this.countDown < 1) {
        this.close.next(true);
        clearInterval(this.counterInterval);
      }
    }, 1000);
  }

  public ngAfterViewInit(): void {
    this.onFocus(0);
  }

  public ngOnDestroy(): void {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  }

  public onFocus(index: number): void {
    if (this.inputs.toArray()[index]) {
      this.inputs.toArray()[index].nativeElement.focus();
      this.inputs.toArray()[index].nativeElement.select();
    } else {
      this.submitButton.nativeElement.focus();
    }
  }

  public submit(): void {
    this.validationChecked = true;
    if (this.verificationForm.valid) {
      this.isCheckingCode = true;
      const code = (this.verificationForm.get('code') as FormArray).controls
        .map((control) => control.value)
        .join('');
      this.authService
        .checkVerificationCode(code)
        .subscribe((isValidCode: boolean) => {
          this.validateCode.next(isValidCode);
          this.isCheckingCode = false;
        });
    }
  }
}
