const axiosInstance = axios.create({
    baseURL : "http://localhost:3000/user"
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
            alert("login succesfully")
            //localStorage.setItem('token' , result.data.token)
            window.location.href ="/views/homepage.html"
        }
    }catch(e){
        if (error.response) {
            const errorMessage = error.response.data.message;
            alert(errorMessage);
          } else {
            alert("An error occurred. Please try again later.");
          }
    }

}