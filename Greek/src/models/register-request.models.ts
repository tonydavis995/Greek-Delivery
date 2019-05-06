import {Serializable} from "./serializalble.interface";

export class RegisterRequest {
	email: string;
	username: string;
	password: string;
	roles: string;
  first_name:string;
  last_name:string;
	
	constructor(email: string, username: string, password: string) {
        this.email = email;
		this.username = username;
		this.password = password;
		this.roles = 'contributor';
    this.first_name='';
    this.last_name='';
    }
}