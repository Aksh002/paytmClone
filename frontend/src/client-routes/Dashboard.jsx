import { Suspense, useEffect, useState } from "react";
//import { AllUsers } from "../components/AllUsers";
import { Topbar } from "../components/Topbar";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Dashboard(){
    const [users,setUsers]=useState([])
    const [filter,setFilter]=useState('')
    const [searchParams]=useSearchParams()
    const [bal,setBal]=useState('')
    const name=searchParams.get("name")
    const email=searchParams.get("email")
    const id=searchParams.get("id")
    const navigate=useNavigate()

    // Wrong url will throw u at signin
    if (!name || !email || !id){
        localStorage.clear("token")
        navigate("/signin")
    }
    useEffect(()=>{
        const delayDebouncedFxn=setTimeout(()=>{                                    // This is done to implement DEBOUNCING         //delayDebounceFn stores the ID of the timeout so that we can later clear it if needed. 
            axios.get("http://localhost:3000/api/v1/user/bulk?filter="+filter,{
                headers:{
                    Authorization:"Bearer " + localStorage.getItem("token")
                }
            })
            .then(res=>{
                setUsers(res.data.users)
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
              })
        },500)
        return (()=>clearTimeout(delayDebouncedFxn))   
        },[filter])

    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/account/balance",{
            headers:{
                Authorization:"Bearer " + localStorage.getItem("token")
            }
        })
        .then((res)=>{
            setBal(res.data.balance)
        })
    })

    useEffect(() => {
        const token = localStorage.getItem("token"); // Assume token is stored in localStorage
        if (!token){
            navigate("/signin")
        }
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:3000/api/v1/user/me", {
              headers: {
                token: token // Sending token in headers as 'token'
              }
            });
    
            if (!response.data.user) {
                console.log(response.data.msg); // Log error message (e.g., "User not found")
                navigate("/signin")
            } else {
              const { firstname, username, _id } = response.data.user;
              navigate(`/dashboard?name=${firstname}&email=${username}&id=${_id}`);
            }
          } catch (error) {
            console.error("Error fetching user data", error);
            navigate("/signin")
            // Stay on the same page if there's an error
          }
        };
    
        if (token) {
          fetchData();
        }
      }, [navigate]);


    return <div>
        <div>
            <div > 
                <Topbar name={name}></Topbar>
            </div>
            
            <div className="mx-14">
                <h3 className="text-md font-semibold mt-6">Your Balance
                    <span className="ml-2 text-lg font-bold">Rs {bal}</span>
                </h3>
                <h3 className="mt-6 text-xl font-bold mb-2">Users</h3>
                    <div className="w-full  min-w-[200px] ">
                        <div className="relative flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                            </svg>
                        
                            <input onChange={(e)=>
                                setFilter(e.target.value)
                                
                            }
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="UI Kits, Dashboards..." 
                            />
                            
                            <button
                            className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            type="button"
                            >
                            Search
                            </button> 
                        </div>
                    </div>                    
                    <div>{users.filter(user => user.id !== id).map((user, index) => {
                            return <AllUsers key={index} user={user}></AllUsers>;
                    })}
                    </div>
            </div>
        </div>
    </div>
}
function AllUsers({user}){
    const navigate=useNavigate()
    return <div> 
        <div className="flex justify-between pt-8 pb-2 items-center">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center ">
                    <span className="text-md text-gray-800 font-semibold">{user.firstname[0].toUpperCase()}</span>
                </div>
                <span className="text-md">{user.firstname + " "+ user.lastname}</span>
            </div>
            <div>
                <button onClick={()=>{
                    navigate("/send?id=" + user.id + "&name=" + user.firstname)
                }} className="rounded-md bg-slate-800  px-8 py-1.5 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
                    Send Money
                </button>
            </div>
        </div>
    </div>
}