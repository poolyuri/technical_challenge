class PersonInfoKey {
  id: string;
}

export class PersonEntity extends PersonInfoKey {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
}
