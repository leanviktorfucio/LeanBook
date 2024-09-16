import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GLOBAL_SEVER_DOMAIN_URL } from '../../Config/Constants';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    constructor(private httpClient: HttpClient) {}

    registerForm = new FormGroup({
        username: new FormControl(''),
        email: new FormControl(''),
        firstname: new FormControl(''),
        lastname: new FormControl(''),
        password: new FormControl(''),
        confirmPassword: new FormControl('')
    })

    onRegister(e: Event) {
        e.preventDefault();

        var self = this;

        this.httpClient.post(GLOBAL_SEVER_DOMAIN_URL + '/register', {
            username: this.registerForm.value.username,
            email: this.registerForm.value.email,
            firstname: this.registerForm.value.firstname,
            lastname: this.registerForm.value.lastname,
            password: this.registerForm.value.password,
            confirmPassword: this.registerForm.value.confirmPassword
        }).subscribe({
            next: (response) => {
                console.log('next', response);  // Handle success response
            },
            error: (response) => {
                console.log('error', response);  // Handle error response
            },
            complete: () => {
                console.log('complete');  // No argument is passed to complete
            }
        });
    }
}
