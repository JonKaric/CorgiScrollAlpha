import { Options } from './../types/types';

export function Arrows(CorgiScroll: any, options: Options) {

    function build() {  
        let arrows = document.createElement('div')
        arrows.classList.add('corgiscroll__arrows')

        const HTML  = `
            <button class="corgiscroll__arrow corgiscroll__arrow--left">
                ${options.arrowLeftHtml}
            </button>
            <button class="corgiscroll__arrow corgiscroll__arrow--right">
                ${options.arrowRightHtml}
            </button>
        `

        arrows.innerHTML = HTML;
        CorgiScroll.slideContainer.after(arrows);
    }

    function initEvents() {
        CorgiScroll.root.querySelector('.corgiscroll__arrow--left').addEventListener('click', () => {
            CorgiScroll.prev();
        })
        CorgiScroll.root.querySelector('.corgiscroll__arrow--right').addEventListener('click', () => {
            CorgiScroll.next();  
        })
    }
    
    return {
        init: () => {
            build();
            initEvents();
        }
    }
}