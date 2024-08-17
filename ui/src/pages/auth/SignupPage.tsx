import React from 'react'
import SingupForm from '../../components/SignupForm'
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Redirect, useHistory } from 'react-router';

function SignupPage() {
    const [cachedUser, setCachedUser] = useLocalStorage("user", null);

    const history = useHistory();
    if (cachedUser) {
         history.push("/dashboard");
        return <>Redirecting</>
        }

  return (
    <SingupForm />
  )
}

export default SignupPage