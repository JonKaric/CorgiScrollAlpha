import { Options } from './../types/types';
import Events from './../Events';

export function Arrows(CorgiScroll: any, options: Options) {

    const events = Events(CorgiScroll)
    const { on, emit } = events


    /**
     * @description Builds the html 
     * 
     * */
    function build() {  
        let arrows = document.createElement('div')
        arrows.classList.add('corgiscroll__arrows')


        const HTML  = `
            <button class="corgiscroll__arrow corgiscroll__arrow--left">w
                ${options.arrowLeftHtml}
            </button>
            <button class="corgiscroll__arrow corgiscroll__arrow--right">
                ${options.arrowRightHtml}
            </button>
        `

        arrows.innerHTML = HTML;
        CorgiScroll.root.after(arrows);
        
    }

    function initEvents() {
        CorgiScroll.querySelector('.corgiscroll__arrow--left').addEventListener('click', CorgiScroll.prev())
        CorgiScroll.querySelector('.corgiscroll__arrow--right').addEventListener('click', CorgiScroll.next())
    }

    return {
        init: () => {
            build();
        }
    }

}