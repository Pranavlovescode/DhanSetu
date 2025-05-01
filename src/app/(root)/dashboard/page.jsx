'use client'
import { UserAccountCreation } from '@/utils/apis/accountCreation';
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'

function Dashboard() {
  const {isSignedIn, user} = useUser();
  const [userAccount,setUserAccount] = useState({})

  useEffect(()=>{
    console.log(user)
    fetchUserAccount();
  },[isSignedIn])

  const fetchUserAccount = async()=>{
    const response = await UserAccountCreation.getCurrentUserAccount(user?.id);
    if (response.status == 200) {
      console.log('user account found',response.data.user_account[0])
      setUserAccount(response.data.user_account[0])
    }
  }

  return (    
    <div>
      This is your Dashboard {userAccount.account_id}
    </div>
  )
}

export default Dashboard
