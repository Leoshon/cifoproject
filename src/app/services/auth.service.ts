import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  [x: string]: any;
  constructor(private auth: Auth) {}
  async login(usuario: User) {
    return await signInWithEmailAndPassword(
      this.auth,
      usuario.email,
      usuario.password
    );

  }
  async register(usuario: User) {
    return await createUserWithEmailAndPassword(
      this.auth,
      usuario.email,
      usuario.password
    );
  }
  async updateUser(usuario: User) {
    return await updateProfile(this.auth.currentUser!, {
      displayName: usuario.nombre,
    });
  }
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  async logout() {
    return await signOut(this.auth);
  }
}
