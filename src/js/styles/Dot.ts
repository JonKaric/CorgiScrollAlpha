import { Options, Pagination } from '../types/types';


export function PaginationDot(options: Options, pagination: Pagination ) {
    
    let current = 0;

    build();
    initEvents();

    function build() {
        const html = `
            ${
                pagination.slides.map((slide: HTMLElement, index: number) => {
                    return `<button class="corgiscroll__pagination-dot" data-index="${index}"><span class="">${index}</span></button>`
                }).join('')
            }
        `

        options.pagination.innerHTML = html;

    }

    function initEvents() {
        options.pagination.addEventListener('click', handleClick)
        options.pagination.addEventListener('scroll', handleScroll)
    }

    function handleClick(e: Event) {

        const getLeftPosition = (index: number) => {
            return pagination.slides[index].snapPoint 
        }
        
        if (e.target.getAttribute('data-index')) {
            const slide: number = parseInt(e.target.getAttribute('data-index'))
            console.log(pagination.slides[slide].snapPoint);
            options.root.scrollTo({
                top: 0,
                left: getLeftPosition(slide),
                behavior: 'smooth'
            })
        }
    }


    function handleScroll() {
        
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


        // console.log(pagination.slides);
        

        const closestNumber = closest(
            pagination.slides.map(
                page => page.snapPoint
            ), 
            options.root.scrollLeft
        );

        const currentIndex = Array.from(pagination.slides).findIndex(slide => {
            return slide.snapPoint === closestNumber;
        });
    
        handlePagination(currentIndex);
    }

    function handlePagination(currentIndex: number) {
        pagination.el!.children[current].classList.remove('active')
        pagination.el!.children[currentIndex].classList.add('active')
        current = currentIndex;
    }

}