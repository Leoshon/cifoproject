import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { setDoc } from 'firebase/firestore';
import { getDownloadURL, uploadString } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(private auth: Auth,private firestore: Firestore, private storage: Storage) { }
  getUserProfile(){
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore,`userDocRef/${user?.uid}`);
    return docData(userDocRef);

  }
   getUserInfo(){
    const user = this.auth.currentUser;
    const userRef = doc(this.firestore,`users/${user?.uid}`);
    return docData(userRef);
  }
  async uploadImage(photo: Photo){
    const user = this.auth.currentUser;
    const path = `uploads/${user?.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
    try{
      await uploadString(storageRef, photo.base64String!, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(this.firestore,`userDocRef/${user?.uid}`);
      await setDoc(userDocRef,  {imageUrl});
      return true;
    }catch(error){
      return null;
    }
  }
  
}
