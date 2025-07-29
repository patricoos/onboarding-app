import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from '@/pages/notfound/notfound';
import { Dashboard } from '@/pages/dashboard/dashboard';
import { Onboarding } from '@/pages/onboarding/components/onboarding/onboarding';
import { Users } from '@/pages/onboarding/components/users/users';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // { path: '', component: Dashboard },
            { path: '', component: Onboarding },
            { path: 'management', component: Onboarding },
            { path: 'users', component: Users },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
