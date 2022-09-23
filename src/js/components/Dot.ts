import { Options, Pagination } from '../types/types';
import Events from './../Events'
import { FindSteps } from '../utils/FindSteps';

export function PaginationDot(CorgiScroll: any, options: Options, pagination: Pagination ) {
    
    /**
     * Beep boop. Event bus has arrived
     */
    const events = Events(CorgiScroll)
    const { on, emit } = events

    /**
     * The active pagination item
     */
    let current: number = 0;

    let rootBounds = () => {
        return CorgiScroll.slideContainer.getBoundingClientRect();
    }
    
    
    /**
     * 
     * @returns The maximum scroll possible
     */
    const getMaxScroll = () => {
        return CorgiScroll.slideContainer.scrollWidth - rootBounds.width
    }

    /**
     * 
     * @param array Array that you want to look inside
     * @param goal The nunmber you want to find the closest of
     * @returns The number that is closest to your goal in the array 
     */
    const closest = (array: (number)[], goal: number) => array.reduce((prev, curr) => {
        // console.log(`Curr: ${curr}`);
        // console.log(`Prev: ${prev}`);

        // console.log(`Goal: ${goal}`);
        // console.log(`scrollW ${CorgiScroll.slideContainer.scrollWidth}`);
        // console.log(`w ${rootBounds.width}`);
        

        // console.log(`Max Left Size: ${CorgiScroll.slideContainer.scrollWidth - rootBounds().width}`);
        
        
        if (goal >= getMaxScroll() || curr <= goal) return curr
        else return prev
    })


    const closestNumber = () => {
        
        
        //console.log(pagination.slides);
        
        return closest(
            pagination.slides.map(
                (page: any /* TODO: Fix this type */) => page.snapPoint
            ), 
            Math.ceil(CorgiScroll.slideContainer.scrollLeft)
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
        
        if (pagination.slides.length == 0) {
            pagination.el = null;
            return;   
        }

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
                    if (index === current) return `<button class="corgiscroll__pagination-dot active" data-index="${index}"><span class="">${index}</span></button>`
                    return `<button class="corgiscroll__pagination-dot" data-index="${index}"><span class="">${index}</span></button>`
                }).join('')
            }
        `

        el.innerHTML = html;
        pagination.el = el;
        CorgiScroll.slideContainer.after(el)

        emit('update_active', current)
    }

    function initEvents() {
        if (pagination.el) {
            pagination.el.addEventListener('click', handleClick)
        }
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
        if (pagination.el === null) { return }
        const currentIndex = Array.from(pagination.slides).findIndex((slide: any /* TODO: Fix this type */) => {
            return slide.snapPoint === closestNumber();
        });

        emit('update_active', currentIndex)
    })


    function destroy() {
        if (pagination.el == null) return
        CorgiScroll.pagination.el.removeEventListener('click', handleClick)
        CorgiScroll.pagination.el.remove()
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