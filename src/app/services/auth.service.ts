import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth:Auth) { }
  async login({email, password}: {email: string, password: string}){
    try{
   const user = await signInWithEmailAndPassword(this.auth,email,password);
    return user;
   }catch(error){
      console.log(error);
      return null;
   }
  }
  async register({email, password}: {email: string, password: string}){
    try{
       const user = await createUserWithEmailAndPassword(this.auth,email,password);
       return user;
    }catch(error){
       console.log(error);
       return null;
    }
 }
  async logout(){
    return await signOut(this.auth);
  }
}
