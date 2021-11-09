import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  constructor(private modalController: ModalController, private api: ApiService) {}

  ionViewWillEnter() {
    if (window.localStorage.getItem('loggedIn') !== 'true') {
      this.presentLoginModal();
    } else {
      this.getAccountDetails();
    }
  }

  async presentLoginModal() {
      const modal = await this.modalController.create({
        component: LoginComponent
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
    const modal = await this.modalController.create({
      component: TaskComponent
    });
    modal.onDidDismiss().then(() => {
    });

    return await modal.present();
  }

}
