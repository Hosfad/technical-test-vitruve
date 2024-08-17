import { IonContent, IonPage } from "@ionic/react";
import { css } from "../../styled-system/css";
import PokemonList from "../components/pokemon/PokemonList";

const Tab1: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className={css({ marginTop: 20 })}>
                    <PokemonList></PokemonList>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Tab1;
