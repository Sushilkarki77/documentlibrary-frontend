import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";
import { Documents } from "./documents/components/documents-wrapper/documents";
import { Search } from "./search/search";



export const DashboardRoutes: Routes = [
    {
        path: '', component: Dashboard, children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: Search },
            { path: 'documents', component: Documents }
        ]
    },
    { path: '**', redirectTo: 'search' }
]