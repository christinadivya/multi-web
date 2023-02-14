import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/service/register.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html'
})
export class AppLayoutComponent implements OnInit {

  toggleClass = true ? false : true;

  constructor(public service: RegisterService,
              private router: Router) { }

  ngOnInit() {
  }

  sideMenuChange(val) {
    this.toggleClass = val;
  }

}
