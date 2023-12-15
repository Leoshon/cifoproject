import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { addDoc, collection, query, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, uploadString } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FireService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}
  /* getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `userDocRef/${user?.uid}`);
    return docData(userDocRef);
  } */
  getUserInfo() {
    const user = this.auth.currentUser;
    const userRef = doc(this.firestore, `users/${user?.uid}`);
    return docData(userRef);
  }
  async uploadImage(photo: Photo) {
    const user = this.auth.currentUser;
    const path = `${user?.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
    try {
      //await uploadString(storageRef, photo.base64String!, 'base64');
      await uploadString(storageRef, photo.dataUrl!, 'data_url');
      const imageUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
      await setDoc(userDocRef, { imageUrl });
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
}
