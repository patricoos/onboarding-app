import { Component } from '@angular/core';
import { LayoutService } from '../service/layout.service';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Onboarding App by
        <a href="https://www.intechnity.com/" target="_blank" pTooltip="Intechnity sp. z o.o." tooltipPosition="top" class="w-auto">
            <img src="assets/images/{{ layoutService._config.darkTheme ? 'intechnity-light' : 'intechnity-dark' }}.png" alt="Logo" class="h-[2rem]"
        /></a>
    </div>`
})
export class AppFooter {
    constructor(public layoutService: LayoutService) {}
}
