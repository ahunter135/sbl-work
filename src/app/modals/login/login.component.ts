import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = 'ahunter8850@outlook.com';
  password = 'Test1234!';
  constructor(private modalController: ModalController,
    private api: ApiService) { }

  ngOnInit() {}

  async signIn() {
    const response = await this.api.post('Authentication/Login', {
      email: this.email,
      password: this.password
    }) as any;

    if (response.isAuthSuccessful) {
      this.modalController.dismiss();
      window.localStorage.setItem('loggedIn', 'true');
    }
  }

}
