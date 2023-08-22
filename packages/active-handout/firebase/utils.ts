export function getAppName() {
  return import.meta.env.PUBLIC_FIREBASE_APP_NAME || "active-handout";
}
