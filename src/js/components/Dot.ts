import { Options, Pagination } from '../types/types';
import Events from './../Events'

export function PaginationDot(CorgiScroll: any, options: Options, pagination: Pagination ) {
    
    /**
     * Beep boop. Event bus has arrived
     */
    const events = Events(CorgiScroll)
    const { on, emit } = events

    /**
     * The active pagination item
     */
    let current = 0;


    
    /**
     * 
     * @returns The maximum scroll possible
     */
    const getMaxScroll = () => {
        return CorgiScroll.slideContainer.scrollWidth - options.rootBounds.width
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


    const closestNumber = () => {
        return closest(
            pagination.slides.map(
                (page: any /* TODO: Fix this type */) => page.snapPoint
            ), 
            CorgiScroll.slideContainer.scrollLeft
        )
    }

    /**
     * Initialise the component
     */
    init()


    function init() {
        build()
        initEvents()
    }

    function build() {
        const el = document.createElement('div')
        el.classList.add('corgiscroll-pagination')


        
        

        const currentIndex = Array.from(pagination.slides).findIndex((slide: any /* TODO: Fix this type */) => {
            return slide.snapPoint === closestNumber();
        });

        current = currentIndex;
        

        const html = `
            ${
                // @ts-ignore
                pagination.slides.map((slide, index: number) => {
                    if (index === currentIndex) return `<button class="corgiscroll__pagination-dot active" data-index="${index}"><span class="">${index}</span></button>`
                    return `<button class="corgiscroll__pagination-dot" data-index="${index}"><span class="">${index}</span></button>`
                }).join('')
            }
        `

        el.innerHTML = html;
        CorgiScroll.pagination.el = el;
        CorgiScroll.slideContainer.after(el)

        emit('update_active', currentIndex)
    }

    function initEvents() {
        pagination.el!.addEventListener('click', handleClick)
    }

    function handleClick(e: Event) {
        const target = e.target as HTMLElement;
        if (target.getAttribute('data-index')) {
            //TODO: Fix this type 
            // @ts-ignore
            CorgiScroll.go(parseInt(target.getAttribute('data-index')))
        }
    }

    on('scroll', () => {

        const currentIndex = Array.from(pagination.slides).findIndex((slide: any /* TODO: Fix this type */) => {
            return slide.snapPoint === closestNumber();
        });
        
        emit('update_active', currentIndex)
    })


    function destroy() {
        CorgiScroll.pagination.el.removeEventListener('click', handleClick);
        CorgiScroll.pagination.el.remove();
    }

    on('update_active', (currentIndex: number) => {
        CorgiScroll.pagination.el.children[current].classList.remove('active')
        CorgiScroll.pagination.el.children[currentIndex].classList.add('active')
        current = currentIndex;
    })

    on('refresh', () => {
        destroy()
        init()
    })
}