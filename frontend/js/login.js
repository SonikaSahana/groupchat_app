const axiosInstance = axios.create({
    baseURL : "http://3.25.113.52:3000/user"
    })
    

document.getElementById('login').addEventListener('submit' , loginUser)

async function loginUser(e){
    e.preventDefault()
    console.log("the event", e)
    const data = {
        email : e.target.email.value,
        password : e.target.password.value
    }
    console.log(data)

    try{
        const result = await axiosInstance.post('/login' , data)
        console.log(result)
        if(result.data.success){
            alert("login succesfully");
            localStorage.setItem('token' , result.data.token);
            window.location.href ="/views/homepage.html";
        }
    }catch(e){
        alert(e.response.data.message)
    }
}