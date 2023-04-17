import { Component, Input, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.scss']
})
export class TutorialDetailsComponent implements OnInit {

  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    published: false
  };
  
  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getTutorial(this.route.snapshot.params["id"]);
    }
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id)
      .subscribe({
        next: (data) => {
          this.currentTutorial = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      published: status
    };

    this.message = '';

    this.tutorialService.update(this.currentTutorial.id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentTutorial.published = status;
          this.message = res.message ? res.message : 'The status was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }

  updateTutorial(): void {
    this.message = '';

    Swal.fire({
      title: 'Are you sure you want to update this Tutorial?',
      text: "Data will be updated!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tutorialService.update(this.currentTutorial.id, this.currentTutorial)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.message = res.message ? res.message : 'This tutorial was updated successfully!';
            Swal.fire(
              'Updted!',
              'Tutorial has been updted.',
              'success'
            )
          },
          error: (e) => console.error(e)
      });
      }
    });
  }

  deleteTutorial(): void {
    Swal.fire({
      title: 'Are you sure you want to delete this Tutorial?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tutorialService.delete(this.currentTutorial.id)
          .subscribe({
            next: (res) => {
              console.log(res);
              Swal.fire(
                'Deleted!',
                'Your Tutorial has been deleted.',
                'success'
              )
              this.router.navigate(['/tutorials']);
            },
            error: (e) => console.error(e)
          });
      }
    })
    
  }

}