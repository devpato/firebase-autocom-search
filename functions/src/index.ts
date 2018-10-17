import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const env = functions.config();

import * as algoliasearch from "algoliasearch";

// Initialize the Algolia Client
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex("movies_search");

exports.indexMovie = functions.firestore
  .document("movies/{movielId}")
  .onCreate((snap, context) => {
    const data = snap.data();
    const objectID = snap.id;

    // Add the data to the algolia index
    return index.addObject({
      objectID,
      ...data
    });
  });

exports.unindexMovie = functions.firestore
  .document("movies/{movielId}")
  .onDelete((snap, context) => {
    const objectId = snap.id;

    // Delete an ID from the index
    return index.deleteObject(objectId);
  });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
