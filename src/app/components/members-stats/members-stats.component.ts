import { Component, OnInit,Input } from '@angular/core';
import { Events } from 'src/app/models/event.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-members-stats',
  templateUrl: './members-stats.component.html',
  styleUrls: ['./members-stats.component.scss'],
})
export class MembersStatsComponent  implements OnInit {
@Input() uid: any;
events: Events[] = [];

  constructor( private utilsServ: UtilsService,
    private firebaseServ: FireBaseService) { }
 
  ngOnInit() {
    console.log(this.uid);
    this.getEventsByUser();
  }
  getEventsByUser() {
    let path = `users/${this.uid}/events`;
   
    let sub = this.firebaseServ.getEvents(path).subscribe({
      next: (events: any) => {
        console.log(events);
        this.events = events;
        
        sub.unsubscribe();
      },
    });
  }
}
