firebase.initializeApp({
  apiKey: "AIzaSyChh0P2PuJA25vmvVtBoDQhOzgJrxgURss",
  authDomain: "timetracker-47f14.firebaseapp.com",
  projectId: "timetracker-47f14",
});

const subscribers = [];

export const AUTH_CHANGED = 'AUTH_CHANGED';
export const db = firebase.firestore();
export const auth = firebase.auth();

export const subscribe = (subscription) => {
  const index = subscribers.push(subscription);
  return () => {
    subscribers.splice(index, 1);
  }
}

export const publish = action => subscribers.forEach(subscriber => subscriber(action));

export const authWithEmail = email

auth.onAuthStateChanged((user) => {
  publish({
    action: AUTH_CHANGED,
    user,
  });
});


