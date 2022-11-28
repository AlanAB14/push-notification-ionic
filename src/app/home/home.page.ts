import { Component, OnInit } from '@angular/core';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  mensajes = [];

  constructor( public pushService: PushService ) {}
  ngOnInit(): void {
    // this.pushService.pushListener.subscribe( noti => {
    //   this.mensajes.unshift( noti )
    // })
  }

}
