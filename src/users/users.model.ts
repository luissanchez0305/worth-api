export class User {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public lastname: string,
    public phone: string,
    public emailCode: string,
    public SMSCode: string,
    public oneSignal_id: string,
    public isPremium: boolean,
    public password: string,
    public isValidated: boolean,
  ) {}
}
