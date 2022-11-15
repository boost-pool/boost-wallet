
import {
  IonPage,
  IonHeader,
  IonToolbar, IonTitle, IonContent
} from '@ionic/react';
const Web3 = () => {

  const Web = () => (
   <div className="w-full h-screen" dangerouslySetInnerHTML={{ __html: "<iframe src='https://cardano.date/' width='100%' height='100%' allow={'clipboard-read; clipboard-write self https://cardano.date/'} allowFullScreen/>"}} />
  );
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Web/>
      </IonContent>
    </IonPage>
  );
};

export default Web3;
