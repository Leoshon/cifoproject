import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AvatarService } from 'src/app/services/avatar.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-add-update-event',
  templateUrl: './add-update-event.component.html',
  styleUrls: ['./add-update-event.component.scss'],
})
export class AddUpdateEventComponent implements OnInit {

  utlisServ = inject(UtilsService);
  fireServ = inject(AvatarService);
  authServ = inject(AvatarService);
  eventForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private avatarServ: AvatarService,
    private utilsServ: UtilsService,
  ) { }
  get categoria() {
    return this.eventForm.get('categoria');
  }
  get descripcion() {
    return this.eventForm.get('descripcion');
  }
  get precio() {
    return this.eventForm.get('precio');
  }
  get pais() {
    return this.eventForm.get('pais');
  }
  get image() {
    return this.eventForm.get('image');
  }
  ngOnInit(): void {
    this.eventForm = this.fb.group({
      id: [''],
      categoria: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }
  async closeModal(){
    await this.utlisServ.dismisModal();
  }
  async takePhoto(){
    const dataUrl = (await this.utlisServ.takePhoto('Agregar foto')).dataUrl;
    this.eventForm.get('image')?.setValue(dataUrl);
  }
}
