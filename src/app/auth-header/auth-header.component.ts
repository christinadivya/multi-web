import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LanguageService } from '../service/language.service';
import { GeneralService } from '../service/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html'
})
export class AuthHeaderComponent implements OnInit {

  modalRef: BsModalRef;
  langData: any = {common: '', loginHeaderPage: ''};
  forgotData: any = {};
  resetData: any = {};
  togglePassword = false;
  passEye: any = './assets/images/businessin-icons/eye-slash.svg';
  input_type: any = 'password';
  togglePassword1 = false;
  passEye1: any = './assets/images/businessin-icons/eye-slash.svg';
  input_type1: any = 'password';
  loading = false;
  @ViewChild('resetpassword') public reset: TemplateRef<any>;

  constructor(private modalService: BsModalService, private language: LanguageService,
    public services: GeneralService, private toastr: ToastrService) {}

  openModal(template: TemplateRef<any>) {
    console.log(template);

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-md auth-modal br-44' })
    );
  }

  onSubmit(forgotForm) {
    this.loading = true;
    this.services.requestOTP(this.forgotData).subscribe(res => {
      if (res['status']['status'] === 200) {
        this.toastr.success(res['status']['msg']);
        this.loading = false;
        this.modalRef.hide();
        forgotForm.reset();
        this.openModal(this.reset);
      } else {
        this.toastr.error(res['status']['msg']);
        this.loading = false;
      }
    });
  }

  closereset(resetform) {
    this.modalRef.hide();
    resetform.reset();
  }

  resetSubmit(resetForm) {
    this.loading = true;
    this.services.verifyOTP(this.resetData).subscribe(res => {
      if (res['status']['status'] === 200) {
        this.toastr.success(res['status']['msg']);
        this.loading = false;
        this.modalRef.hide();
        resetForm.reset();
      } else {
        this.toastr.error(res['status']['msg']);
        this.loading = false;
      }
    });
    console.log('resetdata ', this.resetData);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  passwordToggle() {
    this.togglePassword = !this.togglePassword;
    if (this.togglePassword) {
      this.passEye = './assets/images/businessin-icons/eye.svg';
      this.input_type = 'text';
    } else {
      this.passEye = './assets/images/businessin-icons/eye-slash.svg';
      this.input_type = 'password';
    }
  }

  passwordToggle1() {
    this.togglePassword1 = !this.togglePassword1;
    if (this.togglePassword1) {
      this.passEye1 = './assets/images/businessin-icons/eye.svg';
      this.input_type1 = 'text';
    } else {
      this.passEye1 = './assets/images/businessin-icons/eye-slash.svg';
      this.input_type1 = 'password';
    }
  }

  ngOnInit() {
    this.fetchLanguage();
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

}
