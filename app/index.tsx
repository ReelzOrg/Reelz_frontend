import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { getToken } from '@/utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { setJwtToken } from '@/state/slices/userTokenSlice';

export default function Index() {
  const dispatch = useDispatch();
  // const token = useSelector((state: any) => state.reelzUserToken.jwtToken);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const config = async () => {
      const token = await getToken('reelzUserToken')
      console.log("token is:", !!token);

      if (!!token) {
        setIsLoggedIn(true);
        dispatch(setJwtToken(token)); //save the token in redux store for faster access
        console.log("we have the token");
      } else {
        console.log("there is no token, so no user logged in");
      }
      setIsLoading(false);
    }

    config();
  }, []);

  console.log("there is a user:",  isLoggedIn);
  
  if(isLoading) {
    return (<></>);
  }
  return <Redirect href={isLoggedIn ? '/(tabs)/home' : '/(auth)/login'} />;
}