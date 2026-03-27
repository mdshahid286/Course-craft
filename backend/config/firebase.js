const admin = require('firebase-admin');

let db = null;
let auth = null;

try {
  // If we have a service account JSON file, initialize it.
  // Otherwise, don't even call initializeApp() to avoid crashes on .firestore()
  const serviceAccountPath = process.env.FIREBASE_CREDENTIALS;
  if (serviceAccountPath) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('Firebase Admin initialized successfully.');
  } else {
    console.log('Firebase Admin skipped: No FIREBASE_CREDENTIALS provided in environment.');
  }
} catch (error) {
  console.warn('Firebase Admin init warning:', error.message);
}

module.exports = { admin, db, auth };
