import { api, setStoredToken } from "../../../services/api.js";

export async function register({username,email,password}){ 
   try{
    const response = await api.post('/api/auth/register', {
        username,
        email,
        password
    });
    setStoredToken(response.data?.token);
    return response.data;
   }
   catch(error){
    console.error('Registration error:', error);
    throw error;
   }

}

export async function login({email,password}){
    try{
        const response=await api.post('/api/auth/login',{
            email,
            password
        })
        setStoredToken(response.data?.token);
        return response.data;

    }catch(error){
        console.error('Login error:', error);
        throw error;
    }
}

export async function logout(){
    try{
        const response=await api.get('/api/auth/logout',{
        })
        setStoredToken(null);
        return response.data;
    }catch(error){
        console.error('Logout error:', error);
        throw error;
    }
}

export async function getMe(){
    try{
        const response=await api.get('/api/auth/get-me',{
        })
        return response.data;
    }catch(error){
        console.error('Get Me error:', error);
        throw error;
    }
}
