import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import "./Tab1.css";
import { css } from "../../styled-system/css";
import ErrorBoundary from "../components/Error";
import PokemonList from "../components/PokemonList";

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
                    })}
                >

                    <PokemonList></PokemonList>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Tab1;
