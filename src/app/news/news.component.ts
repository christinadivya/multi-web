import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor() {


   }

  ngOnInit() {
    this.addWidget('https://www.feedgrabbr.com/widget/fgwidget.js');
  }
  addWidget(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = true;
    script.defer = true;
    console.log('script', script);
    body.appendChild(script);
  }


}
