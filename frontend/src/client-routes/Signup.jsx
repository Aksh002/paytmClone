import { useEffect, useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { Subheading } from "../components/Subheading"
import axios from "axios"
import { data } from "autoprefixer"
import { useNavigate } from "react-router-dom"

export const Signup=()=>{
    const [name,setName]=useState('')
    const [lname,setLname]=useState('')
    const [email,setEmail]=useState('')
    const [pswd,setPswd]=useState('')

    const navigate=useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token"); // Assume token is stored in localStorage
    
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:3000/api/v1/user/me", {
              headers: {
                token: token // Sending token in headers as 'token'
              }
            });
    
            if (response.data.user) {
              // If user data is successfully retrieved, navigate to dashboard with query params
              const { firstname, username, _id } = response.data.user;
              navigate(`/dashboard?name=${firstname}&email=${username}&id=${_id}`);
            } else {
              console.log(response.data.msg); // Log error message (e.g., "User not found")
            }
          } catch (error) {
            //console.error(error);
            alert(error.response.data.msg)
            navigate("/signup")
            // Stay on the same page if there's an error
          }
        };
    
        if (token) {
          fetchData();
        }
      }, [navigate]);

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-2xl lg:bg-white w-80 text-center p-2 h-max px-4 space-y-1">
                <Heading label={"Sign up"} ></Heading>
                <Subheading label={"Enter your information to create an account"}></Subheading>
                <InputBox onChange={(e)=>{
                    setName(e.target.value)
                }} placeholder={"akshit"} label={"First Name"}></InputBox>
                <InputBox onChange={e =>{
                    setLname(e.target.value)
                }} placeholder={"gangwar"} label={"Last Name"}></InputBox>
                <InputBox onChange={e =>{
                    setEmail(e.target.value)
                }} placeholder={"akshit@gmail.com"} label={"E-mail"}></InputBox>
                <InputBox onChange={e =>{
                    setPswd(e.target.value)
                }} placeholder={"123456"} label={"Password"}></InputBox>
                <div className="pt-4">
                    <Button onClick={async ()=>{
                        try{const response =await axios.post("http://localhost:3000/api/v1/user/signup",{
                            username:email,
                            password:pswd,
                            firstname:name.charAt(0).toUpperCase()+name.slice(1),
                            lastname:lname
                        })
                        localStorage.setItem("token",response.data.token)
                        navigate("/dashboard?name="+name+"&email="+email+"&id="+response.data.id) //Cant be used here bcs we are not just switching page, we need to transfer some parameters 
                        }catch(error){
                            console.log(error.response.data.msg)
                            alert(error.response.data.msg)
                            navigate("/signup")
                        }
                    }} label={"Sign Up"}></Button>
                </div>
                <BottomWarning  label={"Already have an account?"} linkText={"Sign in"} to={"/signin"}></BottomWarning>
            </div>
        </div>
    </div>
    // We need to pass down these onChange,onClick fxn from these component element props, down to the native button and input elements 
}