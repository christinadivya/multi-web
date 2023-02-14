import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../service/language.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../service/general.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html'
})
export class ContactusComponent implements OnInit {

  contactData: any = {};
  langData: any = {common: '', loginFooterPage: '', createPostPage: '', contactUsPage: ''};
  contactUsForm: FormGroup;
  submitted = false;
  invalidcomment = false;

  constructor(private language: LanguageService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private generalService: GeneralService, private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.fetchLanguage();
    this.createForm();
  }

  fetchLanguage() {
    this.language.getLanguageData(1)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.langData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showError(showError: any) {
    this.toastr.clear();
    this.toastr.error(showError);
  }

  showSuccess(showSuccess: any) {
    this.toastr.clear();
    this.toastr.success(showSuccess);
  }

  createForm() {
    this.contactUsForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      subject: ['', Validators.required],
      comments: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.contactUsForm);
    this.submitted = true;

    if (this.contactUsForm.get('comments').value !== undefined) {
      this.invalidcomment = false;
    }
    if (this.contactUsForm.get('comments').value.length > 0) {
      if (this.contactUsForm.get('comments').value.trim().length === 0) {
        this.invalidcomment = true;
      } else {
        this.invalidcomment = false;
      }
    }

    this.contactUsForm['controls']['fullname'].setValue(this.contactUsForm['controls']['fullname'].value.trim());
    this.contactUsForm['controls']['email'].setValue(this.contactUsForm['controls']['email'].value.trim());
    this.contactUsForm['controls']['subject'].setValue(this.contactUsForm['controls']['subject'].value.trim());
    this.contactUsForm['controls']['comments'].setValue(this.contactUsForm['controls']['comments'].value.trim());

    const data = {
      'fullName': this.contactUsForm['controls']['fullname'].value,
      'email': this.contactUsForm['controls']['email'].value,
      'subject': this.contactUsForm['controls']['subject'].value,
      'comments': this.contactUsForm['controls']['comments'].value,
    };
    console.log('data ', data);
    if (this.contactUsForm.invalid) {
      console.log('createPostForm Valid :', this.contactUsForm.valid);
      this.showError('Please fill required fields');
    }

    if (this.contactUsForm.valid) {
      this.generalService.saveContactUs(data)
      .subscribe(res => {
        console.log(res);
        if (res && res['status'] && res['status'] === 200) {
          this.showSuccess('Your Detail send to Admin successfully!');
          this.router.navigate(['/home']);
          window.scrollTo(0, 0);
        }
      });
    }
  }

}
