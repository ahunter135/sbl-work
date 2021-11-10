import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import {
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ApiService } from 'src/app/services/api.service';

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
  state = 3;
  photoTaken = null;
  constructor(public alertController: AlertController,
    public modalCtrl: ModalController,
    private camera: Camera,
    private scanner: BarcodeScanner,
    private api: ApiService) { }

  ngOnInit() {
    this.scanQR();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  goBack() {
    this.state--;
  }

  async submit() {
    if (this.state === 2) {
      const alert = await this.alertController.create({
        header: 'Submit Test Result',
        message: 'By tapping submit, you are agreeing to share your reported test results with your employer',
        buttons: ['Submit']
      });

      await alert.present();
      alert.onDidDismiss().then(() => {
        //Change pages
        this.state = 3;
      });
    } else if (this.state === 3) {
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
     this.photoTaken = base64Image;
    }, (err) => {
     // Handle error
     alert(JSON.stringify(err));
    });
  }

  async scanQR() {
    this.scanner.scan({
      formats: 'QR_CODE',
      prompt: 'Scan the QR Code on your SBL COVID-19 Rapid Antigen Test Kit'
    }).then(async barcodeData => {
      const data = barcodeData.text;
      if (barcodeData.cancelled) {
        this.modalCtrl.dismiss();
        return;
      }
      const response = await this.api.post('StatusHistory/CheckQrCode', {qrCode: data});

      alert(JSON.stringify(response));
      if (response.isSuccessful) {
        // responds true if allowed
        // false if not
        this.state = 2;
      } else {
        const alert = await this.alertController.create({
          header: 'Invalid QR Code',
          message: 'The QR Code you scanned is invalid or has already been used, please try again.',
          buttons: ['Try again']
        });

        alert.onDidDismiss().then(() => {
          //Do Submit
          this.scanQR();
        });
        await alert.present();
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }
}
