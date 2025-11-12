import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <nav class="sidebar">
        <h1 class="sidebar-title">Angular Flow</h1>
        <p class="sidebar-subtitle">Examples</p>
        <ul class="sidebar-menu">
          <li>
            <a routerLink="/basic" routerLinkActive="active">Basic Example</a>
          </li>
          <li>
            <a routerLink="/custom-nodes" routerLinkActive="active">Custom Nodes</a>
          </li>
          <li>
            <a routerLink="/edge-types" routerLinkActive="active">Edge Types</a>
          </li>
          <li>
            <a routerLink="/interactive" routerLinkActive="active">Interactive</a>
          </li>
        </ul>
        <div class="sidebar-footer">
          <a href="https://github.com/xyflow/xyflow" target="_blank" rel="noopener noreferrer">
            GitHub →
          </a>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    .sidebar {
      width: 250px;
      background: #1a1a1a;
      color: white;
      padding: 24px;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }

    .sidebar-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sidebar-subtitle {
      font-size: 14px;
      color: #888;
      margin: 0 0 24px 0;
    }

    .sidebar-menu {
      list-style: none;
      padding: 0;
      margin: 0;
      flex: 1;
    }

    .sidebar-menu li {
      margin-bottom: 8px;
    }

    .sidebar-menu a {
      display: block;
      padding: 12px 16px;
      color: #ccc;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .sidebar-menu a:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .sidebar-menu a.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .sidebar-footer {
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-footer a {
      color: #888;
      text-decoration: none;
      font-size: 14px;
    }

    .sidebar-footer a:hover {
      color: white;
    }

    .main-content {
      flex: 1;
      overflow: hidden;
      background: #fafafa;
    }
  `],
})
export class AppComponent {
  title = 'Angular Flow Example';
}
