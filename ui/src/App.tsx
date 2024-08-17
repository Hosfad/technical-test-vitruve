import { Link, Redirect, Route } from "react-router-dom";
import {
    IonApp,
    IonButton,
    IonHeader,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar,
    setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import Tab1 from "./pages/Tab1";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

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

/* Theme variables */
import "./theme/variables.css";
import "./index.css";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import { css } from "../styled-system/css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { User } from "./types";

setupIonicReact();

const App: React.FC = () => {
    const [cachedUser, setCachedUser] = useLocalStorage<User | null>(
        "user",
        null
    );
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
                        <a href="/">
                            <IonTitle>Pokédex App</IonTitle>
                        </a>
                        <a href="/dashboard">
                            <IonButton>
                                {cachedUser ? "Dashboard" : "Login"}
                            </IonButton>
                        </a>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route exact path="/">
                        <Tab1 />
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
