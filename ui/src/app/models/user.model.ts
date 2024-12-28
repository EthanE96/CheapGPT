export interface User {
  _id?: string;
  provider: string;
  id: string;
  displayName: string;
  username?: string;
  name?: {
    familyName?: string;
    givenName?: string;
    middleName?: string;
  };
  emails?: Array<{
    value: string;
    type?: string;
  }>;
  photos?: Array<{
    value: string;
  }>;
  createdAt: Date;
  updatedAt?: Date;
}
