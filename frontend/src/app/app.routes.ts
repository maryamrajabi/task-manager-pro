import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { TaskList } from './features/tasks/pages/task-list/task-list';
import { AppShell } from './layout/app-shell/app-shell';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'tasks',
        component: TaskList
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
