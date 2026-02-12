import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, Unsubscribe } from 'firebase/database';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PlayerRecord {
  maxScore: number;
  totalWins: number;
  totalLoses: number;
  totalGames: number;
}

export interface Player {
  id: string;
  username: string;
  score: number;
  records?: {
    [key: string]: PlayerRecord;
  };
  maxRecordScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firebaseApp: any;
  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$ = this.playersSubject.asObservable();
  private unsubscribe: Unsubscribe | null = null;

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
  }

  public loadPlayers(): void {
    const database = getDatabase(this.firebaseApp);
    const playersRef = ref(database, 'players');

    this.unsubscribe = onValue(playersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const players: Player[] = [];

        for (const userId in data) {
          if (data.hasOwnProperty(userId)) {
            const playerData = data[userId];
            const records = playerData.records || {};
            let maxRecordScore = 0;

            // Find the highest score across all records
            for (const recordKey in records) {
              if (records.hasOwnProperty(recordKey)) {
                const recordScore = records[recordKey].maxScore || 0;
                if (recordScore > maxRecordScore) {
                  maxRecordScore = recordScore;
                }
              }
            }

            const player: Player = {
              id: userId,
              username: playerData.username || 'Unknown',
              score: playerData.score || 0,
              records: records,
              maxRecordScore: maxRecordScore
            };

            players.push(player);
          }
        }

        // Sort by maxRecordScore in descending order
        players.sort((a, b) => b.maxRecordScore - a.maxRecordScore);

        this.playersSubject.next(players);
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
