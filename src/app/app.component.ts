import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'simimatch-dashboard';
  isSidenavOpen = false;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  closeSidenav(): void {
    this.isSidenavOpen = false;
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
