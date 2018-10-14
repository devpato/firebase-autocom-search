import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
@Component({
  selector: "app-movies",
  templateUrl: "./movies.component.html",
  styleUrls: ["./movies.component.css"]
})
export class MoviesComponent implements OnInit {
  title: string;
  description: string;
  movieCollection: AngularFirestoreCollection<any>;
  movieObs: any;
  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.movieCollection = this.afs.collection("movies");
    this.movieObs = this.movieCollection.valueChanges();
  }

  // addMovie() { //Custome ID
  //   this.movieCollection
  //     .doc("myid")
  //     .set({
  //       title: this.title,
  //       description: this.description
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  addMovie() {
    this.movieCollection
      .add({
        title: this.title,
        description: this.description
      })
      .then(docRef => {
        this.movieCollection.doc(docRef.id).update({
          movieId: docRef.id
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateMovie(movieId: string) {
    this.movieCollection
      .doc(movieId)
      .update({
        title: this.title,
        description: this.description
      })
      .then(() => {
        console.log("updated");
      });
  }

  removeMovie(movieId: string) {
    this.movieCollection
      .doc(movieId)
      .delete()
      .then(() => {
        console.log("deleted");
      });
  }
}
