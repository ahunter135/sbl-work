import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginComponent } from '../modals/login/login.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private modalController: ModalController) {}

  ionViewWillEnter() {
    //this.presentLoginModal();
  }

  async presentLoginModal() {
    const modal = await this.modalController.create({
      component: LoginComponent
    });
    return await modal.present();
  }

}
