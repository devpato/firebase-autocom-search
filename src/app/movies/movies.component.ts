import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
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
  selectedMovieId: string;
  movieForm = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    movieId: new FormControl("")
  });
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
        title: this.movieForm.get("title").value,
        description: this.movieForm.get("description").value
      })
      .then(docRef => {
        this.movieCollection.doc(docRef.id).update({
          movieId: docRef.id
        });
        console.log(this.movieForm.get("title").value);
        this.movieForm.reset();
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateMovie() {
    const id = this.movieForm.get("movieId").value;
    this.movieCollection
      .doc(id)
      .update({
        title: this.movieForm.get("title").value,
        description: this.movieForm.get("description").value
      })
      .then(() => {
        this.movieForm.reset();
        this.selectedMovieId = this.movieForm.get("movieId").value;
        console.log("updated");
        console.log(this.selectedMovieId);
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

  selectMovie(id: string, title: string, description: string) {
    this.movieForm.get("title").setValue(title);
    this.movieForm.get("description").setValue(description);
    this.movieForm.get("movieId").setValue(id);
    this.selectedMovieId = this.movieForm.get("movieId").value;
  }
}
