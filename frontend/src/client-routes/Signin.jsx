import { useNavigate } from "react-router-dom"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { Subheading } from "../components/Subheading"
import { useEffect, useState } from "react"
import axios from "axios"



export const Signin=()=> {
    const navigate=useNavigate()
    const [email,setEmail]=useState('')
    const [pswd,setPswd]=useState('')

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
            console.error("Error fetching user data", error);
            // Stay on the same page if there's an error
          }
        };
    
        if (token) {
          fetchData();
        }
      }, [navigate]);

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-2xl lg:bg-white w-80 text-center p-2 h-max px-4 space-y-3">
                <Heading label={"Sign in"} ></Heading>
                <Subheading label={"Enter your credentials to access to your account"}></Subheading>
                <InputBox onChange={(e)=>{
                    setEmail(e.target.value)
                }} placeholder={"akshit@gmail.com"} label={"E-mail"}></InputBox>
                <InputBox onChange={(e)=>{
                    setPswd(e.target.value)
                }} placeholder={"123456"} label={"Password"}></InputBox>
                <div className="pt-4">
                    <Button onClick={async ()=>{
                        try{
                            const response=await axios.post("http://localhost:3000/api/v1/user/signin",{
                            username:email,
                            password:pswd
                            })
                            if(response.data.userId){
                                localStorage.setItem("token",response.data.userId)
                                navigate("/dashboard?name="+response.data.firstname+"&email="+email+"&id="+response.data.id)
                            }
                        }catch(error){
                            console.log(error.response.data.msg)
                            alert(error.response.data.msg)
                            navigate("/signin")
                        }
                        
                    }} label={"Sign in"}></Button>
                </div>
                <BottomWarning label={"Don't have an account?"} linkText={"Sign up"} to={"/signup"}></BottomWarning>
            </div>
        </div>
    </div>
}