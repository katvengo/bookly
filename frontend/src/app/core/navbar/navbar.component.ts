import { Component, OnInit } from '@angular/core';
import { APP_TITLE } from '@/shared/constants/common';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
title = APP_TITLE;
  constructor() { }

  ngOnInit() {
  }

}
