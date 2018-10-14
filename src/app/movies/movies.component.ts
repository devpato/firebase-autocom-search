import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore'
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
  }

  addMovie() {
    
  }

}
