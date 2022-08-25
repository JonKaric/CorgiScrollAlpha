import { Options, Pagination } from './types/types';
import { PaginationDot }  from "./styles/Dot";
import { FindSteps } from "./utils/FindSteps";
import { debounce } from './utils/debounce';

export default class CorgiScroll {

    root: HTMLElement
    rootBounds: any = {}
    options: any = {}
    pagination: Pagination
    windowWidth: number
    events: any = {}
    
    constructor(root: HTMLElement, options: Options) {
        this.root = root
        this.rootBounds = this.root.getBoundingClientRect()
        this.windowWidth = window.innerWidth


        const events: any = {
            'resize': new Event('corgiscroll:resize')
        }

        const defaults: Options = {
            root: this.root,
            rootBounds: this.rootBounds,
            pagination: this.generateInitialPagination(),
            style: 'dot',
            type: 'page',
            snapType: getComputedStyle(this.root.children[0]).getPropertyValue('scroll-snap-align')
        }
        
        this.options = Object.assign(defaults, options)

        this.pagination = {
            el: null,
            slides: FindSteps(this.options, this.root)
        }

        this.init()
    } 

    init() {
        this.initialiseSlideClasses()
        window.addEventListener('resize', this.handleResize)

        PaginationDot(this.options, this.pagination)
    }

    // handleResize() {
    //     const resize = debounce(() => {
    //         console.log('hi');
    //         // if (resizeWidth < window.innerWidth || resizeWidth > window.innerWidth) {
                
    //         // }
    //     }, 500);

    //     resize();
    // }

    handleResize: (ev: Event) => void = debounce(() => {
        if (this.windowWidth < window.innerWidth || this.windowWidth > window.innerWidth) {
            this.refresh()
            this.windowWidth = window.innerWidth
        }
    }, 200)

    generateInitialPagination() {
        const pagination = document.createElement('div')
        pagination.classList.add('corgiscroll-pagination')
        this.root.after(pagination)
        return pagination
    }

    initialiseSlideClasses() {
        Array.from(this.root.children).forEach((slide, index ) => {
            let info = slide.getBoundingClientRect()
            slide.setAttribute('data-slide', index.toString())
            slide.setAttribute('data-position', info.x.toString())
        })
    }

    refresh() {
        document.querySelector('.corgiscroll-pagination')?.remove()
        this.options.rootBounds = this.root.getBoundingClientRect()
        this.options.pagination = this.generateInitialPagination()
        this.pagination.slides  = FindSteps(this.options, this.root)
        PaginationDot(this.options, this.pagination)
    }

}