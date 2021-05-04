import * as admin from 'firebase-admin';

//$env:GOOGLE_APPLICATION_CREDENTIALS="D:\Azrieli\שנה ד\פרוייקט גמר\final_project_management_system\src\Firebase\project-sdk.json"

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://project-management-system-oz-default-rtdb.firebaseio.com/'
  });