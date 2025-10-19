/* eslint-disable prettier/prettier */

export class UserModel {
    id: number;
    name: string;
    email: string;
    password: string;
    salt?: string;
    creation_date: Date;
    profile_pic_url?: string;
    admin?: boolean;
    update_date?: Date;
    deleted_at?: Date;
    

    constructor(id: number, name: string, email: string, password: string) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
    }
}