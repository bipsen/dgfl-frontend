import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA83KLVc2sYNF2bAyoY-udjThXGQ5R-7qQ",
    authDomain: "dgfl-6ff09.firebaseapp.com",
    projectId: "dgfl-6ff09",
    storageBucket: "dgfl-6ff09.appspot.com",
    messagingSenderId: "248570066881",
    appId: "1:248570066881:web:ec674f6572bb7dd9fe2140",
    measurementId: "G-YY52G0Z5K9"
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export { firebaseApp, analytics }