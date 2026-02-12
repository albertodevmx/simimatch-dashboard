import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FirebaseService, Player } from '../../services/firebase.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['rank', 'username', 'maxRecordScore', 'totalGames'];
  dataSource: Player[] = [];
  paginatedData: Player[] = [];

  // Pagination properties
  pageSize = 25;
  pageIndex = 0;
  totalPlayers = 0;

  private destroy$ = new Subject<void>();

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.loadPlayers();
    this.firebaseService.players$
      .pipe(takeUntil(this.destroy$))
      .subscribe((players) => {
        this.dataSource = players;
        this.totalPlayers = players.length;
        this.updatePaginatedData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  private updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.slice(startIndex, endIndex);
  }

  getRank(index: number): number {
    return this.pageIndex * this.pageSize + index + 1;
  }

  getTotalGames(player: Player): number {
    if (!player.records) return 0;
    let total = 0;
    for (const recordKey in player.records) {
      if (player.records.hasOwnProperty(recordKey)) {
        total += player.records[recordKey].totalGames || 0;
      }
    }
    return total;
  }
}
