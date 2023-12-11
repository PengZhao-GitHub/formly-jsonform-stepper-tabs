import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { Subject } from 'rxjs';

import { tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-jsonform',
  templateUrl: './jsonform.component.html',
  styleUrls: ['./jsonform.component.scss'],
})
export class JsonformComponent {

  @Input() schema: any;

  private destroy$: Subject<any> = new Subject<any>();

  e: any;

  form: FormGroup = new FormGroup({});

  model: any;

  options: FormlyFormOptions = {
    formState: {
      disabled: true,
    },
  };

  fields: FormlyFieldConfig[] = [];

  type: string = '';

  examples = [
    'simple',
    'nested',
    'arrays',
    'numbers',
    'references',
    'schema_dependencies',
    'null_field',
    'nullable',
    'allOf',
    'anyOf',
    'oneOf',
    'select_alternatives',
    'quote'
  ];

  constructor(private formlyJsonschema: FormlyJsonschema, private http: HttpClient, private fb: FormBuilder) {
    this.loadExample(this.examples[0]);

  }


  loadExample(type: string) {
    console.log(type)
    this.http
      .get<any>(`assets/json-schema/${type}.json`)
      .pipe(
        tap(({ schema, model }) => {
          this.type = type;
          this.form = new FormGroup({});
          this.options = {};
          this.fields = [this.formlyJsonschema.toFieldConfig(schema)];
          this.model = model;

          //if type is quote, reformat the fields
          //if (type === 'quote') {
          this.fields = this.formatQuoteFields(this.fields);
          //}

          console.log("schema:", schema)
          console.log("model:", model)
          console.log("fields:", this.fields)
          console.log("options:", this.options)

        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  submit() {
    console.log("submit-model", this.model)
    console.log("submit-fields", this.fields)

    //alert(JSON.stringify(this.model));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


  formatQuoteFields(fields: FormlyFieldConfig[]) {
    console.log("formatQuoteFields", fields)

    fields[0].type = 'stepper';

    fields[0].fieldGroup?.forEach(f => {
      if (f.key === 'risk') {
        console.log("riskField", f)

        const elements = document.querySelector('formly-array-type');
        elements?.childNodes.forEach((element: any) => {
          //change background color to red
          console.log("element", element)

          //change background color to red
          element.style.backgroundColor = 'red';

        })
      }
    })

    return fields;
  }


  modelChange(e: any) {
    console.log("click -> model chanage", e)


  }


}
