import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { getToken, saveToken } from '@/utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { setJwtToken } from '@/state/slices/userTokenSlice';
import { getData, postData } from '@/utils';
import { setUser } from '@/state/slices';

export default function Index() {
  const baseurl = process.env.EXPO_PUBLIC_BASE_URL || "http://192.168.252.240:3000";
  const dispatch = useDispatch();
  // const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const config = async () => {
      // console.log("token is:", !!token);
      // await saveToken("", 'reelzUserToken');
      const token = await getToken('reelzUserToken')

      if (!!token) {
        setIsLoggedIn(true);
        dispatch(setJwtToken(token)); //save the token in redux store for faster access
        // console.log("we have the token");

        //get basic data for the user
        const loggedInUser = await getData(`${baseurl}/api/user/`, token);
        const userData = await loggedInUser?.json();
        // console.log("userData is:", userData);
        dispatch(setUser(userData.user[0]))

        //also check the validty of the token by sending the token to the server
        //if the token has been tampered with then redirect the user to the login page
      } else {
        console.log("there is no token, so no user logged in");
      }
      setIsLoading(false);
    }

    config();
  }, []);

  // console.log("there is a user:",  isLoggedIn);
  
  if(isLoading) {
    return (<></>);
  }
  return <Redirect href={isLoggedIn ? '/(tabs)/home' : '/(auth)/login'} />;
}