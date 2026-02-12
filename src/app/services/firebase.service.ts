import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, Unsubscribe } from 'firebase/database';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PlayerRecord {
  playerName: string;
  employeeNumber: string;
  score: number;
  status?: string;
  startTime?: string;
}

export interface Player {
  id: string;
  playerName: string;
  employeeNumber: string;
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
            let playerName = '';
            let employeeNumber = '';

            // Find the highest score across all records and extract player info
            for (const recordKey in records) {
              if (records.hasOwnProperty(recordKey)) {
                const record = records[recordKey];
                const recordScore = record.score || 0;

                if (recordScore > maxRecordScore) {
                  maxRecordScore = recordScore;
                }

                // Capture player info from the first record (they should all have the same)
                if (!playerName && record.playerName) {
                  playerName = record.playerName;
                }
                if (!employeeNumber && record.employeeNumber) {
                  employeeNumber = record.employeeNumber;
                }
              }
            }

            // Only add players with records
            if (Object.keys(records).length > 0) {
              const player: Player = {
                id: userId,
                playerName: playerName || 'Unknown',
                employeeNumber: employeeNumber || 'N/A',
                maxRecordScore: maxRecordScore
              };

              players.push(player);
            }
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
