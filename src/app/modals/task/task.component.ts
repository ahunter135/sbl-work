import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import {
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  animations: [
    trigger('slideOut', [
      transition(':leave', [
        animate('100ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideOutIn', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('200ms 350ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('50ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class TaskComponent implements OnInit {
  state = 1;
  photoTaken = null;
  constructor(public alertController: AlertController,
    public modalCtrl: ModalController,
    private camera: Camera) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  goBack() {
    this.state--;
  }

  async submit() {
    if (this.state === 1) {
      const alert = await this.alertController.create({
        header: 'Submit Test Result',
        message: 'By tapping submit, you are agreeing to share your reported test results with your employer',
        buttons: ['Submit']
      });

      await alert.present();
      alert.onDidDismiss().then(() => {
        //Change pages
        this.state = 2;
      });
    } else if (this.state === 2) {
      const alert = await this.alertController.create({
        header: 'Submit Proof',
        message: 'By tapping submit, you are agreeing to sharing your reported test results with your employer.',
        buttons: ['Submit']
      });

      await alert.present();
      alert.onDidDismiss().then(() => {
        //Do Submit
        this.modalCtrl.dismiss();
      });
    }
  }

  shouldBeDisabled() {
    return false;
  }

  async takePhoto() {
    // eslint-disable-next-line max-len
    this.photoTaken = 'data:image/jpeg;base64,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';
    return;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: false,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     const base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }

}
