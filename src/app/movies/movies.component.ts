import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { environment } from "../../environments/environment";
import { Chance } from "chance";

import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Subject } from "rxjs";

@Component({
  selector: "app-movies",
  templateUrl: "./movies.component.html",
  styleUrls: ["./movies.component.css"]
})
export class MoviesComponent implements OnInit {
  selectedMovieId: string;
  searchValue: string;

  //Angolia Search

  searchConfig = {
    ...environment.algolia,
    indexName: "movies_search"
  };
  showResults = false;

  movieForm = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    movieId: new FormControl("")
  });
  movieCollection: AngularFirestoreCollection<any>;
  movieObs: any;
  movieSearched: any;
  startAt = new Subject();
  endAt = new Subject();
  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.movieCollection = this.afs.collection("movies");
    this.movieObs = this.movieCollection.valueChanges();
  }

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

  search(param: string) {
    this.startAt.next(param);
    this.endAt.next(param + "\uf8ff");
    this.movieSearched = this.afs
      .collection("movies", ref =>
        ref
          .orderBy("title")
          .startAt(param)
          .endAt(param + "\uf8ff")
      )
      .valueChanges();
  }

  searchChanged(query) {
    if (query.length) {
      this.showResults = true;
    } else {
      this.showResults = false;
    }
  }
}
