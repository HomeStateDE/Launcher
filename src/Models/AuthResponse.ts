export default interface AuthResponse {
    StatusCode: number;
    UserData: Account;
}

interface Account {
    AuthCode: string;
    Avatar: string;
    UserName: string;
}