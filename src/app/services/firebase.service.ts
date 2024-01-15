import { Injectable } from '@angular/core';
import { Auth, } from '@angular/fire/auth';
import { User } from '../models/user.model';
import {
  Firestore,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { addDoc, collection, deleteDoc, query, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, uploadString, deleteObject } from 'firebase/storage';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FireBaseService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private utilService: UtilsService
  ) {}
  getAllUsers() {
    const ref = collection(this.firestore, 'users');
    return collectionData(ref, { idField: 'id' });
  }
   getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user?.uid}`);
    console.log(user)
    return docData(userDocRef);
  } 
 async getUserInfo(usuario:User){
   const userDocRef = doc(this.firestore, `users/${usuario.uid}`);
   return docData(userDocRef);

 }
  async uploadImage(photo: Photo) {
    const user = this.auth.currentUser;
    const path = `${user?.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
    try {
      //await uploadString(storageRef, photo.base64String!, 'base64');
      await uploadString(storageRef, photo.dataUrl!, 'data_url');
      const imageUrl = await getDownloadURL(storageRef);
      const usuario = this.utilService.getFromLocalStorage('user');
      usuario.imageUrl = imageUrl;
      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
      await setDoc(userDocRef, usuario);
      return true;
    } catch (error) {
      return null;
    }
  }
  //agregar documento a la base de datos
  async addDocument(path: string, data: any) {
    return await addDoc(collection(this.firestore, path), data);
  }
  //almacenar datos en la base de datos
  async uploadEventImage(path: string, data_url: string) {
    const storageRef = ref(this.storage, path);
    try {
      //await uploadString(storageRef, photo.base64String!, 'base64');
      await uploadString(storageRef, data_url, 'data_url');
      const imageUrl = await getDownloadURL(storageRef);
      return imageUrl;
    } catch (error) {
      return null;
    }
  }
  getEvents(path: string, collectionquery?: any) {
    const ref = collection(this.firestore, path);
    return collectionData(query(ref, collectionquery), { idField: 'id' });
  }

  async getImgFilePath(url: string) {
    return ref(this.storage, url).fullPath;
  }
  updateEvent(path: string, data: any) {
    return updateDoc(doc(this.firestore, path), data);
  }
  updateUser(user: any) {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return updateDoc(userDocRef, user);
  }
  deleteEvent(path: string, data: any) {
    return deleteDoc(doc(this.firestore, path));
  }
  deleteFile(path: string) {
    return deleteObject(ref(this.storage, path));
  }
}
