import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class LocalStorageInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users/changePassword') && method === 'POST':
                    return changePassword();
                case url.endsWith('/users/update') && method === 'POST':
                    return updateUser();   
                case url.endsWith('/users/updateBuddy') && method === 'POST':
                    return updateBuddyName();
                case url.endsWith('/users/updatePicture') && method === 'POST':
                    return updatePicture();   
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/users/search') && method === 'POST':
                    return searchUser(); 
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            if (user.userType !== 'admin') return error('Only admin can login!');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token',
                pictureUrl: user.pictureUrl
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username.toLowerCase() === user.username.toLowerCase())) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function changePassword() {
            const { newPassword, id} = body;

            const curUser = users.find(user => user.id === id);
            curUser.password = newPassword;
            users = users.filter(x => x.id !== id);
            users.push(curUser);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function updateUser() {
            const { updatedFields, id} = body;

            const curUser = users.find(user => user.id.toString() === id);
            curUser.firstName = updatedFields.firstName;
            curUser.lastName = updatedFields.lastName;
            curUser.location = updatedFields.location;
            curUser.grade = updatedFields.grade;
            curUser.skills = updatedFields.skills;
            
            users = users.filter(x => x.id !== id);
            users.push(curUser);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function updateBuddyName() {
            const { buddyName, id} = body;

            const curUser = users.find(user => user.id.toString() === id);
            curUser.buddyName = buddyName;
            
            users = users.filter(x => x.id.toString() !== id);
            users.push(curUser);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function searchUser() {
            const { searchString, id } = body;
            const results = users.filter(user => 
                user.firstName.toLowerCase().includes(searchString.toLowerCase()) && 
                user.id.toString() !== id &&
                user.userType !== 'admin'
            );
            return ok(results);
        }

        function updatePicture() {
            const { url, id} = body;

            const curUser = users.find(user => user.id === id);
            curUser.pictureUrl = url;

            users = users.filter(x => x.id !== id);
            users.push(curUser);
            localStorage.setItem('users', JSON.stringify(users));

            let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            currentUser.pictureUrl = url;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            return ok(currentUser);
        }
    }
}

export const localStorageProvider = {
    // use local storage  in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: LocalStorageInterceptor,
    multi: true
};