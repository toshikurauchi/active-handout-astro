import config from "virtual:active-handout/user-config";
import {
  initializeApp,
  cert,
  App,
  getApp,
  ServiceAccount,
} from "firebase-admin/app";
import { Database, getDatabase } from "firebase-admin/database";
import { getStorage as getAdminStorage } from "firebase-admin/storage";

const serviceAccount = {
  type: "service_account",
  project_id: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
  client_id: import.meta.env.FIREBASE_CLIENT_ID,
  auth_uri: import.meta.env.FIREBASE_AUTH_URI,
  token_uri: import.meta.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
};

let app: App | undefined;
if (config.auth) {
  const missingVars = [];
  if (!serviceAccount.project_id)
    missingVars.push("PUBLIC_FIREBASE_PROJECT_ID");
  if (!serviceAccount.private_key_id)
    missingVars.push("FIREBASE_PRIVATE_KEY_ID");
  if (!serviceAccount.private_key) missingVars.push("FIREBASE_PRIVATE_KEY");
  if (!serviceAccount.client_email) missingVars.push("FIREBASE_CLIENT_EMAIL");
  if (!serviceAccount.client_id) missingVars.push("FIREBASE_CLIENT_ID");
  if (!serviceAccount.auth_uri) missingVars.push("FIREBASE_AUTH_URI");
  if (!serviceAccount.token_uri) missingVars.push("FIREBASE_TOKEN_URI");
  if (!serviceAccount.auth_provider_x509_cert_url)
    missingVars.push("FIREBASE_AUTH_CERT_URL");
  if (!serviceAccount.client_x509_cert_url)
    missingVars.push("FIREBASE_CLIENT_CERT_URL");

  if (missingVars.length > 0) {
    throw new Error(
      `Missing environment variables for firebase auth: ${missingVars.join(
        ", "
      )}`
    );
  }

  try {
    if (config.auth) {
      app = initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
        databaseURL: import.meta.env.PUBLIC_FIREBASE_DATABASE_URL,
        storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
  } catch (e) {
    app = getApp();
  }
}

let db: Database | undefined;
try {
  db = getDatabase(app);
} catch (e) {
  console.log("Error getting database", e);
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

function getStorage() {
  return getAdminStorage(app);
}

export { app, getDB, getStorage };
