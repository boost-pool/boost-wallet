import React, { useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar, IonTitle, IonContent
} from '@ionic/react';

const Web3 = () => {

    console.log("web333")
  const Web = () => (
      <div > Hellooooo452</div>
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
