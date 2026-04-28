import {createContext,useContext,useState,useEffect} from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext=createContext();

export const useAuth=()=>useContext(AuthContext);


 const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    

    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token){
            api.get('/auth/me')
            .then(res=>setUser(res.data))
            .catch(()=>localStorage.removeItem('token'))
            .finally(()=>setLoading(false));
        }
        else{
            setLoading(false)
        }
    },[]);


    const login=async(email,password)=>{
            console.log('login called with:', email, password);
        try{
             const res=await api.post('/auth/login',{email,password});
              console.log('response:', res.data); 
        localStorage.setItem('token',res.data.token);
        setUser(res.data.user);
        return {success:true}
        }catch(err){
            console.error('LOGIN ERROR:',err.response?.data,err.message);
            throw err
          
        }
       
    }

    const logout=()=>{
        localStorage.removeItem('token');
        setUser(null);
    }

    return(
        <AuthContext.Provider value={{user,loading,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthProvider