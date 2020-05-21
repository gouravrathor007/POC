import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_helpers';
import { AddbuddyComponent } from './addbuddy/addbuddy.component';
import { ImportantLinksComponent } from './important-links/important-links.component';
import { TutorialsComponent } from './tutorials/tutorials.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'addbuddy/:userId', component: AddbuddyComponent},
    { path: 'important-links', component: ImportantLinksComponent},
    { path: 'tutorials', component: TutorialsComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);