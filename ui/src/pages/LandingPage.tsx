import { IonContent, IonPage } from "@ionic/react";
import PokemonList from "../components/pokemon/PokemonList";

const LandingPage: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div
                    style={{
                        marginTop: 80,
                    }}
                >
                    <PokemonList></PokemonList>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;
