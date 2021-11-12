import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private api: ApiService, public router: Router) {}

  logout() {
    this.api.clearAndReset();
    this.router.navigate(['tabs/tab1'])
  }

}
