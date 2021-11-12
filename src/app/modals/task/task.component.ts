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
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { DomSanitizer } from '@angular/platform-browser';

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
  basePhoto = null;
  positive = null;
  qrCode = '';
  constructor(public alertController: AlertController,
    public modalCtrl: ModalController,
    private camera: Camera,
    private scanner: BarcodeScanner,
    private api: ApiService,
    private fileTransfer: FileTransfer,
    private base: Base64,
    private sanitization: DomSanitizer) { }

  ngOnInit() {
    //this.scanQR();
  }

  close() {
    this.modalCtrl.dismiss();
  }
  radioChanged(event) {
    this.positive = parseInt(event.detail.value);
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
        this.api.post('StatusHistory', {statusId: this.positive, qrCode: this.qrCode})
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
        this.upload(this.photoTaken, this.api.baseUrl + 'StatusHistory/UploadTestResult')
      });
    }
  }

  shouldBeDisabled() {
    if (this.state == 2) {
      return this.positive == null;
    } else {
      return this.photoTaken == null;
    }
  }

  async takePhoto() {
      const options: CameraOptions = {
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA
      };
  
      this.camera.getPicture(options).then(async (imageData) => {
       this.photoTaken = imageData;   
       this.basePhoto = await this.base.encodeFile(imageData); 
       this.basePhoto = this.sanitization.bypassSecurityTrustUrl(this.basePhoto); 
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

      if (response.isSuccessful) {
        // responds true if allowed
        // false if not
        this.qrCode = data;
        this.state = 2;
      } else {
        const alert = await this.alertController.create({
          header: 'Invalid QR Code',
          message: 'The QR Code you scanned is invalid or has already been used, please try again.',
          buttons: ['Try again']
        });

        alert.onDidDismiss().then(() => {
          //Do Submit
          //this.state = 2;
          this.scanQR();
        });
        await alert.present();
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }

  async upload(path, endpoint) {
    try {
      const file = this.fileTransfer.create();
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'results.jpg',
        headers: {
          'Authorization': this.api.accessToken ? ('Bearer ' + this.api.accessToken) : ''
        }
      }
    
      file.upload(path, endpoint, options)
      .then(async (data) => {
        // success
        if (data.responseCode == 200) {
          const alert = await this.alertController.create({
            header: 'Success',
            message: 'Thank you for submitting your results!',
            buttons: ['Done']
          });
    
          await alert.present();
          alert.onDidDismiss().then(() => {
            //Do Submit
            this.modalCtrl.dismiss();
          });
        }
      }, async (err) => {
        // error
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Something went wrong...',
          buttons: ['Done']
        });
  
        await alert.present();
        alert.onDidDismiss().then(() => {
          //Do Submit
          this.modalCtrl.dismiss();
        });
      })  
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Something went wrong...',
        buttons: ['Done']
      });

      await alert.present();
      alert.onDidDismiss().then(() => {
        //Do Submit
        this.modalCtrl.dismiss();
      });
    }
    
  }
}
