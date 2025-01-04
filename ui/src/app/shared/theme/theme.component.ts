import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeComponent implements OnInit {
  defaultTheme: string = 'dark'; // change default daisyui theme
  alternateTheme: string = 'bumblebee'; // change alternate daisyui theme
  currentTheme: string = this.defaultTheme;
  logo: string = this.currentLogo();

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    this.setTheme(this.currentTheme);
    this.logo = this.currentLogo();
  }
  setTheme(theme: string): void {
    const htmlElement = document.querySelector('html') || document.body;
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    this.currentTheme =
      this.currentTheme === this.defaultTheme
        ? this.alternateTheme
        : this.defaultTheme;

    this.setTheme(this.currentTheme);
    this.logo = this.currentLogo();
  }

  currentLogo() {
    if (this.currentTheme === 'dark') {
      return './cheapgpt_logo_dark.png';
    } else if (this.currentTheme === 'bumblebee') {
      return './cheapgpt_logo_bumblebee.png';
    }
    return `./cheapgpt_logo_dark.png`;
  }
}
