import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = <any>'';
  password = <any>'';
  showForgotPassword = false;
  constructor(private modalController: ModalController,
    private api: ApiService) { }

  ngOnInit() {}

  async signIn() {
    if (this.email.length == 0) alert("Please enter a valid email");
    else if (this.password.length == 0) alert("Please enter a valid password");
    const response = await this.api.post('Authentication/Login', {
      email: this.email,
      password: this.password
    }) as any;
    if (response && response.isAuthSuccessful) {
      this.modalController.dismiss();
      window.localStorage.setItem('loggedIn', 'true');
    } else if (response && response.error.errorMessage) {
        alert(response.error.errorMessage);
    } else {
      alert("Please enter a valid email/password");
    }
  }

  async reset() {
    const response = await this.api.post('Authentication/ForgotPassword', {
      email: this.email
    }) as any;

    if (response == null) {
      alert("Reset email sent!");
      this.showForgotPassword = false;
    }
    else if (response.status == 400) {
      alert("Something went wrong, try again.")
    } 
  }

}
