import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Текст политики из приложенного к ТЗ файла, разбит на два раздела с якорями
@Component({
  selector: 'app-policy',
  imports: [RouterLink],
  templateUrl: './policy.html',
  styleUrl: './policy.scss',
})
export class Policy {}
