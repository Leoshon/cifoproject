import { Component, OnInit, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comments, Events } from '../../models/event.model';
import { User } from '../../models/user.model';
import { FireBaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { GetCommentsComponent } from '../get-comments/get-comments.component';
import { TranslateModuleService } from '../../services/translate-module.service';

@Component({
  selector: 'app-members-stats',
  templateUrl: './members-stats.component.html',
  styleUrls: ['./members-stats.component.scss'],
})
export class MembersStatsComponent implements OnInit {
  @Input() uid: any;
  events: Events[] = [];
  comentar = false;
  formattedDate: string = '';
  comments: Comments[] = [
    {
      id: '',
      user: '',
      comment: '',
      date: new Date(),
    },
  ];
  usuario!: User;
  eventForm!: FormGroup;
  translate = inject(TranslateModuleService);

  constructor(
    private utilsServ: UtilsService,
    private firebaseServ: FireBaseService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.usuario = this.utilsServ.getFromLocalStorage('user');
    this.eventForm = this.formBuilder.group({
      id: this.usuario.uid,
      user: [this.usuario.nombre],
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      date: [Date.now().toString()],
    });
  }
  ionViewWillEnter() {
    this.getEventsByUser();
  }
  sendComment(id: any) {
    const path = `users/${this.uid}/events/${id}/comments`;
    this.firebaseServ.addDocument(path, this.eventForm.value).then(() => {
      this.eventForm.reset();
    });
  }

  callModal(id: any) {
    this.utilsServ.presentModal({
      component: GetCommentsComponent,
      componentProps: {
        id: id,
        uid: this.uid,
      },
    });
  }
  getEventsByUser() {
    let path = `users/${this.uid}/events`;

    let sub = this.firebaseServ.getEvents(path).subscribe({
      next: (events: any) => {
        this.events = events;

        sub.unsubscribe();
      },
    });
  }
}
