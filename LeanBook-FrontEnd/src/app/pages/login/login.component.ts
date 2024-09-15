import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GLOBAL_SEVER_DOMAIN_URL } from '../../Config/Constants';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    constructor(private httpClient: HttpClient) {}

    loginForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    })

    onLogin(e: Event) {
        e.preventDefault();

        this.httpClient.post(GLOBAL_SEVER_DOMAIN_URL + '/auth/login', {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password
        }).subscribe(
            (response) => {
                console.log('success', response);
            },
            (response) => {
                console.log('error', response);
            },
            () => {
                console.log('completed');
            }
        );
    }
}
