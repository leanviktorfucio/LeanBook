import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GLOBAL_SEVER_DOMAIN_URL } from '../../Config/Constants';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
    profileForm = new FormGroup({
        username: new FormControl(''),
        email: new FormControl(''),
        firstname: new FormControl(''),
        lastname: new FormControl('')
    })

    constructor(private httpClient: HttpClient) {
        // get data from server (no need to do middle man authorization as much as possible)
        // wait for jwt is implemented so we don't need to put url param
        this.httpClient.get(GLOBAL_SEVER_DOMAIN_URL + '/profile/', { withCredentials: true }).subscribe({
            next: (response: any) => {
                this.onLoad(response);
            },
            error: (response) => {
                console.log('error', response);  // Handle error response
            },
            complete: () => {
                console.log('complete');  // No argument is passed to complete
            }
        });

        // set default information
        // implement update basic info
    }

    onLoad = (response: any): void => {
        this.profileForm.patchValue({
            username: response.username,
            email: response.email,
            firstname: response.firstname,
            lastname: response.lastname
        });
    }

    onProfileUpdate = (e: Event): void => {
        this.httpClient.patch(GLOBAL_SEVER_DOMAIN_URL + '/profile/', {
            username: this.profileForm.value.username,
            email: this.profileForm.value.email,
            firstname: this.profileForm.value.firstname,
            lastname: this.profileForm.value.lastname
        }, { withCredentials: true }).subscribe({
            next: (response: any) => {
                debugger;
                this.onLoad(response);
            },
            error: (response) => {
                debugger;
                console.log('error', response);  // Handle error response
            },
            complete: () => {
                console.log('complete');  // No argument is passed to complete
            }
        });
    }

    updatePasswordForm = new FormGroup({
        oldPassword: new FormControl(''),
        newPassword: new FormControl(''),
        confirmNewPassword: new FormControl('')
    })

    onUpdatePassword = (e : Event): void => {

    }
}
