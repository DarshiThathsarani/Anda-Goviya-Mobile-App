import axios from "axios";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const API_KEY = "AIzaSyC0ewRCRF-ALGVBLJSsDOgRX9XubQKVRC0";

async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;
  return token;
}
export async function createUser(email, password) {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const accessToken = await user.getIdToken();

    return { user, accessToken };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Error [${errorCode}]: ${errorMessage}`);
    throw error;
  }
}

export async function login(email, password) {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const accessToken = await user.getIdToken();

    return { user, accessToken };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.errorMessage;
    console.error(`Error [${errorCode}]: ${errorMessage}`);
    throw error;
  }
}
