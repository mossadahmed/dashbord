
export const getuserdata = async ()=>{
 const token = useCookie<string | null>('token')
    console.log(token);
    
    if (!token.value){
console.error('user is not login');
    };
    const res =  await fetch ('https://api.escuelajs.co/api/v1/auth/profile',{
 headers:{
     Authorization: `Bearer ${token.value}`,
 }
    })
const user = await res.json()
return user

}
