import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../components/logo/logo';
import { RequestModalService } from '../../services/request-modal.service';
import { CONTACTS, MENU } from '../../utils/menu';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly requestModal = inject(RequestModalService);

  protected readonly menu = MENU;
  protected readonly contacts = CONTACTS;

  callMeBack(): void {
    this.requestModal.openConsultation();
  }
}
