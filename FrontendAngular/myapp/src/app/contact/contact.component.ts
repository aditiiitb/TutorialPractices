import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Feedback, ContactType } from "../shared/feedback";
import { flyInOut, expand } from "../animations/app.animation";
import { FeedbackService } from "../services/feedback.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  host: {
    "[@flyInOut]": "true",
    style: "display: block;"
  },
  animations: [flyInOut(), expand()]
})
export class ContactComponent implements OnInit {
  @ViewChild("fform") feedbackFormDirective;

  formErrors = {
    firstname: "",
    lastname: "",
    telnum: "",
    email: ""
  };

  validationMessages = {
    firstname: {
      required: "First name is required.",
      minlength: "First name must be at least 2 chars long",
      maxlength: "First name cannot be more than 25 characters"
    },
    lastname: {
      required: "Last name is required.",
      minlength: "Last name must be at least 2 chars long",
      maxlength: "Last name cannot be more than 25 characters"
    },
    telnum: {
      required: "Tel. number is required",
      pattern: "Tel.number must contain numbers only"
    },
    email: {
      required: "Email is required",
      email: "Email not in valid format"
    }
  };

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  submissionErrMess: string;
  pressedSubmit: boolean;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
      ],
      lastname: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
      ],
      telnum: ["", [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.email]],
      agree: false,
      contacttype: "None",
      message: ""
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear prev error messages
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
  onSubmit() {
    this.pressedSubmit = true;
    this.feedbackService.submitFeedback(this.feedbackForm.value).subscribe(
      feedback => {
        this.feedback = feedback;
        setTimeout(() => {
          this.pressedSubmit = false;
          this.feedback = null;
          this.feedbackForm.reset({
            firstname: "",
            lastname: "",
            telnum: "",
            email: "",
            agree: false,
            contacttype: "None",
            message: ""
          });
          this.feedbackFormDirective.resetForm();
        }, 5000);
      },
      errormess => {
        this.submissionErrMess = errormess;
      }
    );
  }
}
