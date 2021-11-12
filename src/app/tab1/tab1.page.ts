import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { LoginComponent } from '../modals/login/login.component';
import { TaskComponent } from '../modals/task/task.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  status = {} as any;
  loading = false;
  complete = false;
  constructor(private modalController: ModalController, private api: ApiService) {}

  ionViewWillEnter() {
    if (window.localStorage.getItem('loggedIn') !== 'true') {
      this.presentLoginModal();
    } else {
      this.getAccountDetails();
    }
    if (window.localStorage.getItem('task') !== null) {
      let lastTaskDate = moment(window.localStorage.getItem('task'));
      if (moment().isSame(lastTaskDate, 'day')) {
        this.complete = true;
      } else {
        this.complete = false;
      }
    }
  }

  async presentLoginModal() {
      const modal = await this.modalController.create({
        component: LoginComponent,
        backdropDismiss: false
      });
      modal.onDidDismiss().then(() => {
        this.getAccountDetails();
      });

      return await modal.present();
  }

  async getAccountDetails() {
    this.loading = true;
    const response = await this.api.get('Account/Details') as any;
    if (response === null) {
      this.presentLoginModal();
    }
    this.api.userAccount = response;
    this.status = {
      statusName: response.statusName,
      statusDescription: response.statusDescription,
      statusId: response.statusId
    };
    this.loading = false;
  }

  async openTaskModal() {
    if (this.complete) return;
    const modal = await this.modalController.create({
      component: TaskComponent
    });
    modal.onDidDismiss().then(() => {
      if (window.localStorage.getItem('task') !== null) {
        let lastTaskDate = moment(window.localStorage.getItem('task'));
        if (moment().isSame(lastTaskDate, 'day')) {
          this.complete = true;
        } else {
          this.complete = false;
        }
      }
    });

    return await modal.present();
  }

}
