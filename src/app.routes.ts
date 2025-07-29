import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from '@/pages/notfound/notfound';
import { Dashboard } from '@/pages/dashboard/dashboard';
import { Onboarding } from '@/pages/onboarding/components/onboarding/onboarding';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'onboarding', component: Onboarding },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
