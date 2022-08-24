import { Options, Pagination } from './types/types';
import { PaginationDot }  from "./styles/Dot";
import { FindSteps } from "./utils/FindSteps";

export default class CorgiScroll {

    root: HTMLElement
    rootBounds: any = {}
    options: any = {}
    pagination: Pagination
    
    constructor(root: HTMLElement, options: Options) {
        this.root = root
        this.rootBounds = this.root.getBoundingClientRect()

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

        PaginationDot(this.options, this.pagination)
    }

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
}