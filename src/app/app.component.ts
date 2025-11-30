import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { SqliteService } from './services/sqlite-service';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet,],
})
export class AppComponent implements OnInit {
  constructor(private db: SqliteService, private platform: Platform) {}

  async ngOnInit() {
    this.platform.ready().then(async () => {
      await this.db.initDB();
      if (Capacitor.isNativePlatform()) {
        Keyboard.setResizeMode({ mode: KeyboardResize.Ionic });
      }
    });
  }
}
