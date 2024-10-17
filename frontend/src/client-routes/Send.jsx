import { useNavigate, useSearchParams } from "react-router-dom"
import { BottomWarning } from "../components/BottomWarning"
import { Button, GreenButton } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { Subheading } from "../components/Subheading"
import { useState } from "react"
import axios from "axios"

export const Send=()=>{
    const [searchParams]=useSearchParams()
    const [amt,setAmt]=useState(0)
    const[success,setSuccess]=useState(false)
    const navigate=useNavigate()

    const id=searchParams.get("id")
    const name=searchParams.get("name")


    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded lg:bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Send Money"} ></Heading>
                <div>
                    <div className="flex items-center space-x-4 mt-8">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl text-white font-semibold">{name[0]}</span>
                        </div>
                        <h3 className="text-lg font-semibold">{name}</h3>
                    </div>
                
                </div>
                {success?(<div>
                    <div>
                        <h3 className=" text-green-400 font-bold mb-4 mt-2">Transfer Successful !!!</h3>
                    </div>
                    <div>
                        <GreenButton label={"<-- Go Back"} onClick={()=>{
                            navigate("/signup")
                        }}></GreenButton>
                    </div>
                </div>):(<div>
                    <InputBox onChange={(e)=>{
                    setAmt(e.target.value)
                }} placeholder={"Enter Amount"} label={"Amount (in Rs)"}></InputBox>
                <div className="pt-4">
                <GreenButton onClick={
                    async () => {
                            try {
                                const res = await axios.post(
                                    "http://localhost:3000/api/v1/account/transfer",
                                    {
                                        userId: id,
                                        amount: parseInt(amt),
                                    },
                                    {
                                        headers: {
                                            Authorization: "Bearer " + localStorage.getItem("token"),
                                        },
                                    }
                                );

                                if (res.status === 200) {
                                    setSuccess(true);
                                }
                            } catch (error) {
                                // Handle the error case and navigate to /signup
                                if (error.response && error.response.data.msg) {
                                    console.log(error.response.data.msg);
                                    alert(error.response.data.msg)
                                    navigate("/signup");
                                } 
                            }
                        }}
                        label={"Initiate transfer"}
                    />

                </div>
                </div>)
                }
                <BottomWarning label={"Don't have an account?"} linkText={"Sign up"} to={"/signup"}></BottomWarning>
            </div>
        </div>
    </div>
}