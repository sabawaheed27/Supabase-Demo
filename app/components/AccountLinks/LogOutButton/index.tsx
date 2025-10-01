'use client'
import { Logout } from "@/action/log-out";


const LogOutButton =()=>{
    const handleClick =()=>{
        Logout()
    }
    return(
        <button onClick={handleClick}className="button-secondary">LogOut</button>
    )
}
export default LogOutButton;
    