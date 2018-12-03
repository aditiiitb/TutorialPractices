import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { switchMap } from "rxjs/operators";
import { Comment } from "../shared/comment";

import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {visibility, flyInOut} from '../animations/app.animation';

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
  host: {
    '[@flyInOut]': 'true',
    'style' : 'display: block;'
  },
  animations: [
    visibility(), flyInOut()
  ]
})
export class DishdetailComponent implements OnInit {
  @ViewChild("cform") commentFormDirective;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  previewComment: Comment;
  errMess: string;
  dishCopy: Dish;
  visibility = "shown";

  formErrors = {
    comment: "",
    author: ""
  };

  validationMessages = {
    comment: {
      required: "Comment is required."
    },
    author: {
      required: "Your name is required.",
      minlength: "Name must be at least 2 chars long."
    }
  };

  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject("BaseURL") private BaseURL
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(ids => (this.dishIds = ids));
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          this.visibility = "hidden";
          return this.dishservice.getDish(params["id"]);
        })
      )
      .subscribe(
        dish => {
          this.dish = dish;
          this.dishCopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = "shown";
        },
        errmess => {
          this.errMess = <any>errmess;
        }
      );
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: [5, []],
      comment: ["", [Validators.required]],
      author: ["", [Validators.required, Validators.minLength(2)]]
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    this.previewComment = this.commentForm.value;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }
  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.previewComment = this.commentForm.value;
    this.previewComment.date = Date.now().toString();
    this.dishCopy.comments.push(this.previewComment);
    this.dishservice.putDish(this.dishCopy).subscribe(
      dish => {
        this.dish = dish;
        this.dishCopy = dish;
      },
      errmess => {
        this.dish = null;
        this.dishCopy = null;
        this.errMess = <any>errmess;
      }
    );
    // TODO add date thingy
    console.log(this.commentForm.value);
    this.commentForm.reset({
      rating: 5,
      comment: "",
      author: ""
    });
  }
}
