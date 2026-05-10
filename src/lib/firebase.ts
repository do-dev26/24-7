import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { FIREBASE_CONFIG } from './config'

const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG)
export const auth = getAuth(app)
export default app
