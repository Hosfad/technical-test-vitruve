import { useHistory } from "react-router";
import SingupForm from "../../components/SignupForm";
import { useLocalStorage } from "../../hooks/useLocalStorage";

function SignupPage() {
    const [cachedUser, setCachedUser] = useLocalStorage("user", null);

    const history = useHistory();
    if (cachedUser) {
        history.push("/");
        return <>Redirecting</>;
    }

    return <SingupForm />;
}

export default SignupPage;
