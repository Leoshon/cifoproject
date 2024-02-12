import { Component, OnInit, inject } from '@angular/core';
import { FireBaseService } from '../../../services/firebase.service';
import { User } from '../../../models/user.model';
import { UtilsService } from '../../../services/utils.service';
import { Events } from '../../../models/event.model';
import { MembersStatsComponent } from '../../../components/members-stats/members-stats.component';
import { TranslateModuleService } from '../../../services/translate-module.service';

@Component({
  selector: 'app-all-members',
  templateUrl: './all-members.page.html',
  styleUrls: ['./all-members.page.scss'],
})
export class AllMembersPage implements OnInit {
  profile = null as any;
  usuario!: User;
  uid: string = '';
  titulo: string = '';
  events: Events[] = [];
  loading: boolean = false;
  members: any[] = [];
  translate = inject(TranslateModuleService);

  constructor(
    private utilsServ: UtilsService,
    private firebaseServ: FireBaseService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.usuario = this.utilsServ.getFromLocalStorage('user');
    this.getAllUsers();
  }
  doRefresh(event: any) {
    this.getAllUsers();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  getAllUsers() {
    this.firebaseServ.getAllUsers().subscribe({
      next: (users: any) => {
        this.members = users.filter(
          (user: any) => user.uid != this.usuario.uid
        );
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  async membersDetail(uid: string) {
    let success = await this.utilsServ.presentModal({
      component: MembersStatsComponent,
      componentProps: {
        uid: uid,
      },
    });
    if (success) {
      this.getAllUsers();
    }
  }
}
