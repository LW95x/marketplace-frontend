import { Component } from '@angular/core';
import { faYoutube, faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  faYoutube = faYoutube;
  faInstagram = faInstagram;
  faLinkedin = faLinkedin;
  faXTwitter = faXTwitter;
}
