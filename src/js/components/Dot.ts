import { Options, Pagination } from '../types/types';
import Events from './../Events'

export function PaginationDot(CorgiScroll: any, options: Options, pagination: Pagination ) {
    

    const events = Events(CorgiScroll)
    const { on, emit } = events

    let current = 0;
    let paused = false;
    

    build();
    initEvents();

    function build() {
        const el = document.createElement('div')
        el.classList.add('corgiscroll-pagination')

        const html = `
            ${
                pagination.slides.map((slide: HTMLElement, index: number) => {
                    if (index === 0) return `<button class="corgiscroll__pagination-dot active" data-index="${index}"><span class="">${index}</span></button>`
                    return `<button class="corgiscroll__pagination-dot" data-index="${index}"><span class="">${index}</span></button>`
                }).join('')
            }
        `

        el.innerHTML = html;
        CorgiScroll.pagination.el = el;
        CorgiScroll.root.after(el)

    }

    function initEvents() {
        pagination.el!.addEventListener('click', handleClick)
    }

    function handleClick(e: Event) {
        if (e.target.getAttribute('data-index')) {
            CorgiScroll.go(parseInt(e.target.getAttribute('data-index')))
        }
    }

    on('scroll', () => {
        if (paused) return;

        const getMaxScroll = () => {
            return options.root.scrollWidth - options.rootBounds.width
        }

        /**
         * 
         * @param array Array that you want to look inside
         * @param goal The nunmber you want to find the closest of
         * @returns The number that is closest to your goal in the array 
         */
        const closest = (array: (number)[], goal: number) => array.reduce((prev, curr) => {
            if (goal >= getMaxScroll() || curr <= goal) return curr
            else return prev
        })

        const closestNumber = closest(
            pagination.slides.map(
                page => page.snapPoint
            ), 
            options.root.scrollLeft
        );

        const currentIndex = Array.from(pagination.slides).findIndex(slide => {
            return slide.snapPoint === closestNumber;
        });
        
        emit('update_active', currentIndex)
    })

    on('update_active', (currentIndex: number) => {
        CorgiScroll.pagination.el.children[current].classList.remove('active')
        CorgiScroll.pagination.el.children[currentIndex].classList.add('active')
        current = currentIndex;
    })

    on('refresh', () => {
        console.log('hi');

        console.log(CorgiScroll.pagination.el);
        
        
        CorgiScroll.pagination.el.remove();
        build();
    })
}