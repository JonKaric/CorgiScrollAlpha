import { Options, Pagination } from './types/types';
import { PaginationDot }  from "./components/Dot";
import { Arrows } from "./components/Arrows";
import { FindSteps } from "./utils/FindSteps";
import { debounce } from './utils/debounce';
import Events from './Events';



export default class CorgiScroll {

    root: HTMLElement
    slideContainer: HTMLElement // TODO: Fix this type
    rootBounds: any = {}
    options: any = {}
    pagination: Pagination
    windowWidth: number
    events: any = {}
    active: number
    on: any
    emit: any

    constructor(root: HTMLElement, options: Options) {
        this.root = root
        // @ts-ignore  // TODO: Fix this type
        this.slideContainer = this.root.children[0]
        this.rootBounds = this.slideContainer.getBoundingClientRect()
        this.windowWidth = window.innerWidth
        this.active = 0

        const defaults: Options = {
            root: this.root,
            rootBounds: this.rootBounds,
            style: 'dot',
            type: 'page',
            snapType: getComputedStyle(this.root.children[0].children[0]).getPropertyValue('scroll-snap-align'),
            arrowLeftHtml: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g><line x1="13.5" y1="7" x2="0.5" y2="7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></line><polyline points="4 3.5 0.5 7 4 10.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></polyline></g></svg>',
            arrowRightHtml: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g><line x1="0.5" y1="7" x2="13.5" y2="7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></line><polyline points="10 10.5 13.5 7 10 3.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></polyline></g></svg>',
        }
        
        this.options = Object.assign(defaults, options)

        this.pagination = {
            el: null,
            slides: FindSteps(this, this.options, this.slideContainer)
        }

        const event = Events(this)
        this.on = event.on
        this.emit = event.emit

        if (options.arrows) Arrows(this, this.options).init();
        this.init()

    } 

    init() {
        this.initialiseSlideClasses()
        window.addEventListener('resize', this.emit('resized'))
        window.addEventListener('resize', this.handleResize)
        this.slideContainer.addEventListener('scroll', () => {
            this.emit('scroll')
        })

        PaginationDot(this, this.options, this.pagination)
    }


    go(index: number) {
        const getLeftPosition = (index: number) => {
            return this.pagination.slides[index].snapPoint 
        }

        // console.log(getLeftPosition(index));
        

        this.slideContainer.scrollTo({
            top: 0,
            left: getLeftPosition(index),
            behavior: 'smooth'
        })

        this.updateActive(index)
    }

    next() {
        if ((this.active + 1) >= this.pagination.slides.length) return;
        this.go(this.active + 1)
    }

    prev() {
        if ((this.active - 1) < 0) return;
        this.go(this.active - 1)
    }

    updateActive(index: number) {
        this.active = index;
    }

    handleResize: (ev: Event) => void = debounce(() => {
        if (this.windowWidth < window.innerWidth || this.windowWidth > window.innerWidth) {
            this.windowWidth = window.innerWidth

            // const calculatedSteps = FindSteps(this, this.options, this.slideContainer);
            // if (calculatedSteps.length > this.pagination.slides.length || calculatedSteps.length < this.pagination.slides.length) {
            //     this.pagination.slides = FindSteps(this, this.options, this.slideContainer);
            // }

            this.pagination.slides = FindSteps(this, this.options, this.slideContainer);


            this.emit('refresh')
            
            this.emit('resize')
        }
    }, 500)


    initialiseSlideClasses() {
        Array.from(this.slideContainer.children).forEach((slide, index ) => {
            let info = slide.getBoundingClientRect()
            slide.setAttribute('data-slide', index.toString())
            slide.setAttribute('data-position', info.x.toString())
        })
    }
}