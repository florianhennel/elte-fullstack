import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BackComponent } from '../_components/back/back.component';
import { HomeComponent } from '../_components/home/home.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GAME_URL } from '../../globals';
import itemIds from '../../../public/itemIds';
import { ItemService } from '../_services/item.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
      BackComponent,
      HomeComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  url: SafeResourceUrl;
  @ViewChild('iframeElement', { static: true }) iframeElement!: ElementRef<HTMLElement>;

  constructor(private sanitizer: DomSanitizer, private itemService: ItemService) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(GAME_URL);
  }

  ngOnInit(): void {
    window.addEventListener("message", this.receiveMessage, false);
  }

  ngAfterViewInit(): void {
    const iframe: HTMLElement = this.iframeElement.nativeElement;
    iframe.onload = (): void => iframe.focus();
  }

  ngOnDestroy(): void {
    window.removeEventListener("message", this.receiveMessage, false);
  }

  receiveMessage = (event: MessageEvent): void => {
    const id: number = event.data;
    if (itemIds.has(id)) {
      const itemId: string = itemIds.get(id)!;
      this.itemService.assignItem(itemId).subscribe();
    }
  }
}
