import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Camera } from '@ionic-native/camera/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { LoginComponent } from './modals/login/login.component';
import { TaskComponent } from './modals/task/task.component';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [AppComponent, TaskComponent, LoginComponent],
  entryComponents: [],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot({mode: 'ios'}), AppRoutingModule, HttpClientModule, FormsModule, ComponentsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Camera, BarcodeScanner, FileTransfer, Base64],
  bootstrap: [AppComponent],
})
export class AppModule {}
