import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import "./Tab1.css";
import PokemonList from "../components/PokemonList";
import { css } from "../../styled-system/css";
import ErrorBoundary from "../components/Error";

const Tab1: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Pokédex App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div
                    className={css({
                        marginTop: 50,
                    })}
                >
                    <PokemonList></PokemonList>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Tab1;
