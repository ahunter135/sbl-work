import { Component } from '@angular/core';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private deploy: Deploy) {
    //this.performAutomaticUpdate();
  }

  async performAutomaticUpdate() {
    try {
      const currentVersion = await this.deploy.getCurrentVersion();
      const resp = await this.deploy.sync({updateMethod: 'auto'}, percentDone => {
        console.log(`Update is ${percentDone}% done!`);
      });
      if (!currentVersion || currentVersion.versionId !== resp.versionId){
        // We found an update, and are in process of redirecting you since you put auto!
      }else{
        // No update available
      }
    } catch (err) {
      // We encountered an error.
    }
   }

}
