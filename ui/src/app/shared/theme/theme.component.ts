import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeComponent implements OnInit {
  defaultTheme: string = 'dark';
  alternateTheme: string = 'bumblebee';
  currentTheme: string = this.defaultTheme;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    this.setTheme(this.currentTheme);
  }
  setTheme(theme: string): void {
    const htmlElement = document.querySelector('html') || document.body;
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  themeToggle() {
    this.currentTheme =
      this.currentTheme === this.defaultTheme
        ? this.alternateTheme
        : this.defaultTheme;

    this.setTheme(this.currentTheme);
  }
}
