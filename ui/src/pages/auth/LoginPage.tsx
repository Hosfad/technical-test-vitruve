import { useHistory } from "react-router";
import LoginForm from "../../components/LoginForm";
import { useLocalStorage } from "../../hooks/useLocalStorage";

function LoginPage() {
    const [cachedUser, setCachedUser] = useLocalStorage("user", null);
    const history = useHistory();
    if (cachedUser) {
        history.push("/");
        return <>Redirecting</>;
    }

    return <LoginForm />;
}

export default LoginPage;
