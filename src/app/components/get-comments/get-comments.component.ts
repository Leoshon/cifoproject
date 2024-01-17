import { formatDate } from '@angular/common';
import { Component, OnInit, Inject, inject, Input } from '@angular/core';
import { Comments, Events } from 'src/app/models/event.model';
import { User } from 'src/app/models/user.model';
import { FireBaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-get-comments',
  templateUrl: './get-comments.component.html',
  styleUrls: ['./get-comments.component.scss'],
})
export class GetCommentsComponent implements OnInit {
  firebaseServ = inject(FireBaseService);
  utilsServ = inject(UtilsService);
  @Input() id: any;
  @Input() uid: any;

  comments?: any[] = [
    {
      id: '',
      user: '',
      comment: '',
      date: new Date(),
    },
  ];
  constructor() {}

  ngOnInit() {
    console.log(this.id);
    this.getComments(this.id);
  }

  getComments(id: any) {
    let path = `users/${this.uid}/events/${id}/comments`;
    let sub = this.firebaseServ.getEvents(path).subscribe({
      next: (comments: any) => {
        for (let i = 0; i < comments.length; i++) {
          comments[i].date = formatDate(
            comments[i].date,
            'dd/MM/yyyy HH:mm',
            'en-US'
          );
        }

        this.comments = comments;

        sub.unsubscribe();
      }
    });
  }
}
