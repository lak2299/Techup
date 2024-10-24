import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [],
  templateUrl: './form-component.component.html',
  styleUrl: './form-component.component.scss'
})
export class FormComponentComponent {
  @Input() formConfig: { [key: string]: any }[] = [];
  @Output() formSubmit = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form= this.fb.group({})
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.formConfig.forEach((control  ) => {
      if (control['type'] === 'multiselect') {
        this.form.addControl(
          control['name'],
          this.fb.array([]) // Initialize with FormArray for multi-select
        );
      } else {
        const validators = control['required'] ? [Validators.required] : [];
        this.form.addControl(control['name'], this.fb.control('', validators));
      }
    });
  }

  onSelectChange(event: any, controlName: string) {
    const formArray: FormArray = this.form.get(controlName) as FormArray;
    const selectedValue = event.target.value;

    if (event.target.selected) {
      formArray.push(this.fb.control(selectedValue)); // Add selected option
    } else {
      const index = formArray.controls.findIndex(
        (control) => control.value === selectedValue
      );
      formArray.removeAt(index); // Remove unselected option
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
