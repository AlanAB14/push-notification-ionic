import { Injectable } from '@angular/core';

// import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';

import OneSignal from 'onesignal-cordova-plugin';
import { Storage } from '@ionic/storage-angular';
import { EventEmitter } from 'stream';
// import NotificationReceivedEvent from 'onesignal-cordova-plugin/dist/NotificationReceivedEvent';
// import OSNotification from 'onesignal-cordova-plugin/dist/OSNotification';



@Injectable({
  providedIn: 'root'
})
export class PushService {
  private _storage: Storage | null = null;

  mensajes: any[] = [];

  pushListener = new EventEmitter();

  // googleProjectNumber: string = '780388293328';

  // appId: string = '93db4d4f-7398-4b19-b44c-01159c04fdf6';

  constructor( private storage: Storage ) { 
    this.init();
    this.cargarMensajes();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  // configuracionInicial() {
  //   this.oneSignal.setSubscription(true);   

  //   this.oneSignal.startInit(this.appId, this.googleProjectNumber);

  //   this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

  //   this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
  //   // do something when notification is received
  //     console.log('Norificacion recibida', noti)
  //   });

  //   this.oneSignal.handleNotificationOpened().subscribe(( noti ) => {
  //     // do something when a notification is opened
  //     console.log('Notificación abierta', noti)
  //   });

  //   this.oneSignal.endInit();
  // }

      // Call this function when your app starts
      OneSignalInit(): void {
      // Uncomment to set OneSignal device logging to VERBOSE  
      // OneSignal.setLogLevel(6, 0);
    
      // NOTE: Update the setAppId value below with your OneSignal AppId.
      OneSignal.setAppId("93db4d4f-7398-4b19-b44c-01159c04fdf6");

      OneSignal.setNotificationOpenedHandler(function(jsonData) {
          console.log('Notificacion abierta: ' + JSON.stringify(jsonData));
      });

      OneSignal.setNotificationWillShowInForegroundHandler((jsonData) => {
        console.log('Notificacion recibida: ' + jsonData)
        this.notificacionRecibida( jsonData )
      })
    
      // Prompts the user for notification permissions.
      //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
      OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
          console.log("User accepted notifications: " + accepted);
      });
    }

    async notificacionRecibida( noti: any ) {

      await this.cargarMensajes();
      console.log(noti)
      console.log(JSON.parse(noti))
      const payload = noti.aditionalData;

      const existePush = this.mensajes.find( mensaje => mensaje.notificationId === payload.notificationId )

      if (existePush) {
        return;
      }

      this.mensajes.unshift( payload );
      this.pushListener.emit(payload)

      this.guardarMensajes();

    }

    guardarMensajes() {
      this.storage.set('mensajes', this.mensajes);
    }

    async cargarMensajes() {
      this.mensajes = await this.storage.get('mensajes') || [];
    }
}
