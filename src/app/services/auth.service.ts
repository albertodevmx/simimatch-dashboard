import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseApp: any;
  private auth: any;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    const firebaseConfig = {
      apiKey: 'AIzaSyAjnUglhasMWnlcioVpsK83IVthId84D-Y',
      authDomain: 'simicrush.firebaseapp.com',
      databaseURL: 'https://simicrush-default-rtdb.firebaseio.com',
      projectId: 'simicrush',
      storageBucket: 'simicrush.firebasestorage.app',
      messagingSenderId: '414992425253',
      appId: '1:414992425253:web:6d41bede217ef57fa93acc',
      measurementId: 'G-GZ6PE2PK7W'
    };

    this.firebaseApp = initializeApp(firebaseConfig);
    this.auth = getAuth(this.firebaseApp);

    // Monitor auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  public login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public logout(): Promise<void> {
    return signOut(this.auth);
  }

  public isAuthenticated(): Observable<boolean> {
    return new Observable((observer) => {
      this.user$.subscribe((user) => {
        observer.next(!!user);
      });
    });
  }

  public getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}
