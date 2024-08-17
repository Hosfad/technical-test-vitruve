import React from 'react'
import { css } from '../../../styled-system/css'
import { center } from '../../../styled-system/patterns'
import SingupForm from '../../components/SignupForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Redirect, useHistory } from 'react-router';
import LoginForm from '../../components/LoginForm';

function LoginPage() {

    const [cachedUser, setCachedUser] = useLocalStorage("user", null);
    const history = useHistory();
    if (cachedUser) {
        history.push("/dashboard");
        return <>Redirecting</>

    }

    return <LoginForm />
}

export default LoginPage