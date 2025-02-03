import { Global } from "./Global";


export const GetProfile = async (userId, setState, token) => {
    const response = await fetch(`${Global.url}user/profile/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    const data = await response.json();
    if (data.status === 'success') {
        setState(data.user);
    }
    return data;
}