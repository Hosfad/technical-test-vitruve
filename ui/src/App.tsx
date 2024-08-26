import {
    IonApp,
    IonButton,
    IonHeader,
    IonRouterLink,
    IonRouterOutlet,
    IonTitle,
    IonToolbar,
    setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
//import '@ionic/react/css/palettes/dark.system.css';
import "@ionic/react/css/palettes/dark.always.css";
import "./index.css";

/* Theme variables */
import { useEffect } from "react";
import { css } from "../styled-system/css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import "./theme/variables.css";
import { User } from "./types";

setupIonicReact();

const App: React.FC = () => {
    const [cachedUser, setCachedUser] = useLocalStorage<User | null>(
        "user",
        null
    );

    const [lastRefresh, setLastRefresh] = useLocalStorage<number>(
        "lastRefresh",
        0
    );

    // Refresh the user data if the user is online to keep the data up to date
    useEffect(() => {
        if (
            cachedUser &&
            cachedUser.accessToken &&
            navigator.onLine &&
            lastRefresh + 300000 < Date.now()
        ) {
            setLastRefresh(Date.now());
            fetch(`${import.meta.env.VITE_API_URL}/users/@me`, {
                headers: {
                    Authorization: `Bearer ${cachedUser.accessToken}`,
                },
            }).then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setCachedUser(data);
                }
            });
        }
    }, []);

    return (
        <IonApp>
            <IonHeader>
                <IonToolbar>
                    <div
                        className={css({
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        })}
                    >
                        <IonRouterLink href="/">
                            <IonTitle>Pokédex App</IonTitle>
                        </IonRouterLink>
                        <IonRouterLink href="/dashboard">
                            <IonButton>
                                {cachedUser ? "Dashboard" : "Login"}
                            </IonButton>
                        </IonRouterLink>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route exact path="/">
                        <LandingPage />
                    </Route>

                    <Route exact path="/dashboard">
                        <Dashboard />
                    </Route>

                    <Route exact path="/signup">
                        <SignupPage />
                    </Route>

                    <Route exact path="/login">
                        <LoginPage />
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
