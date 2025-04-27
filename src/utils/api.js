import axios from "axios"

export const Auth={
    login:async(fullName,email)=>{
        try {
            const response = await axios.post('/api/register',{fullName:fullName,email:email},{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(response.status===201){
                return response.data
            }
        } catch (error) {
            throw error.response?.data || {message:"An error occured while registration"}
        }
    }
    
}