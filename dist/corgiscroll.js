(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CorgiScroll = factory());
})(this, (function () { 'use strict';

    function Events(CorgiScroll) {
        let e = CorgiScroll.events;
        const on = (event, listener) => {
            if (typeof e[event] !== 'object')
                e[event] = [];
            e[event].push(listener);
        };
        // const removeListener = (event, listener) => {
        //     if(typeof e[event] !== 'object') return;
        //     const idx: number = e[event].indexOf(listener);
        //     if(idx > -1) e[event].splice(idx, 1);
        // }
        const emit = (event, ...args) => {
            if (typeof e[event] !== 'object')
                return;
            e[event].forEach((listener) => {
                listener.apply(null, args);
            });
        };
        return {
            on,
            emit
        };
    }

    function PaginationDot(CorgiScroll, options, pagination) {
        /**
         * Beep boop. Event bus has arrived
         */
        const events = Events(CorgiScroll);
        const { on, emit } = events;
        /**
         * The active pagination item
         */
        let current = 0;
        let rootBounds = CorgiScroll.slideContainer.getBoundingClientRect();
        /**
         *
         * @returns The maximum scroll possible
         */
        const getMaxScroll = () => {
            return CorgiScroll.slideContainer.scrollWidth - rootBounds.width;
        };
        /**
         *
         * @param array Array that you want to look inside
         * @param goal The nunmber you want to find the closest of
         * @returns The number that is closest to your goal in the array
         */
        const closest = (array, goal) => array.reduce((prev, curr) => {
            // console.log(`Curr: ${curr}`);
            // console.log(`Prev: ${prev}`);
            // console.log(`Goal: ${goal}`);
            // console.log(`scrollW ${CorgiScroll.slideContainer.scrollWidth}`);
            // console.log(`w ${rootBounds.width}`);
            // console.log(`Max Left Size: ${CorgiScroll.slideContainer.scrollWidth - rootBounds.width}`);
            if (goal >= getMaxScroll() || curr <= goal)
                return curr;
            else
                return prev;
        });
        const closestNumber = () => {
            //console.log(pagination.slides);
            return closest(pagination.slides.map((page /* TODO: Fix this type */) => page.snapPoint), CorgiScroll.slideContainer.scrollLeft);
        };
        /**
         * Initialise the component
         */
        init();
        function init() {
            build();
            initEvents();
        }
        function build() {
            if (pagination.slides.length == 0) {
                pagination.el = null;
                return;
            }
            const el = document.createElement('div');
            el.classList.add('corgiscroll-pagination');
            const currentIndex = Array.from(pagination.slides).findIndex((slide /* TODO: Fix this type */) => {
                return slide.snapPoint === closestNumber();
            });
            current = currentIndex;
            const html = `
            ${
        // @ts-ignore
        pagination.slides.map((slide, index) => {
            if (index === current)
                return `<button class="corgiscroll__pagination-dot active" data-index="${index}"><span class="">${index}</span></button>`;
            return `<button class="corgiscroll__pagination-dot" data-index="${index}"><span class="">${index}</span></button>`;
        }).join('')}
        `;
            el.innerHTML = html;
            pagination.el = el;
            CorgiScroll.slideContainer.after(el);
            emit('update_active', current);
        }
        function initEvents() {
            if (pagination.el) {
                pagination.el.addEventListener('click', handleClick);
            }
        }
        function handleClick(e) {
            const target = e.target;
            if (target.getAttribute('data-index')) {
                //TODO: Fix this type 
                // @ts-ignore
                CorgiScroll.go(parseInt(target.getAttribute('data-index')));
            }
        }
        on('scroll', () => {
            if (pagination.el === null) {
                return;
            }
            console.log(Array.from(pagination.slides));
            const currentIndex = Array.from(pagination.slides).findIndex((slide /* TODO: Fix this type */) => {
                return slide.snapPoint === closestNumber();
            });
            // console.log(currentIndex);
            emit('update_active', currentIndex);
        });
        function destroy() {
            if (pagination.el == null)
                return;
            CorgiScroll.pagination.el.removeEventListener('click', handleClick);
            CorgiScroll.pagination.el.remove();
        }
        on('update_active', (currentIndex) => {
            CorgiScroll.pagination.el.children[current].classList.remove('active');
            CorgiScroll.pagination.el.children[currentIndex].classList.add('active');
            current = currentIndex;
        });
        on('refresh', () => {
            destroy();
            init();
        });
    }

    function Arrows(CorgiScroll, options) {
        function build() {
            let arrows = document.createElement('div');
            arrows.classList.add('corgiscroll__arrows');
            const HTML = `
            <button class="corgiscroll__arrow corgiscroll__arrow--left">
                ${options.arrowLeftHtml}
            </button>
            <button class="corgiscroll__arrow corgiscroll__arrow--right">
                ${options.arrowRightHtml}
            </button>
        `;
            arrows.innerHTML = HTML;
            CorgiScroll.slideContainer.after(arrows);
        }
        function initEvents() {
            CorgiScroll.root.querySelector('.corgiscroll__arrow--left').addEventListener('click', () => {
                CorgiScroll.prev();
            });
            CorgiScroll.root.querySelector('.corgiscroll__arrow--right').addEventListener('click', () => {
                CorgiScroll.next();
            });
        }
        return {
            init: () => {
                build();
                initEvents();
            }
        };
    }

    function FindSteps(CorgiScroll, options, root) {
        let pagination = [];
        let size = 0;
        let page = 0;
        const snapType = options.snapType;
        const rootRect = root.getBoundingClientRect();
        console.log(rootRect);
        /**
         * @param { Element } element - Element to get the width of
         * @returns { number } Total calculated width including all margins, borders & padding
         */
        const slideWidth = (element) => {
            const style = getComputedStyle(element);
            return parseInt(style.getPropertyValue('margin-left')) + parseInt(style.getPropertyValue('margin-left')) + element.getBoundingClientRect().width;
        };
        /**
         *
         * @param el Element to grab the trigger position of
         * @param index Current index of the loop
         * @returns {number } The trigger position of the element in relation to the container
         */
        const getTriggerPosition = (el, index) => {
            const box = el.getBoundingClientRect();
            if (index === 0)
                return 0;
            if (snapType === 'center')
                return (box.x - rootRect.x) - (rootRect.width / 2);
            else if (snapType === 'start')
                return box.x - rootRect.x + root.scrollLeft;
            return null;
        };
        /**
         *
         * @returns {number} Size of the container
         */
        const getContainerSize = () => {
            if (snapType === 'center') {
                return page === 0 ? (rootRect.width / 2) : rootRect.width;
            }
            else if (snapType === 'start') {
                return rootRect.width;
            }
            return 0;
        };
        if (CorgiScroll.options.mode === 'slide') {
            generateSlide();
        }
        else {
            generatePage();
        }
        function generatePage() {
            Array.from(root.children).forEach((slide, index) => {
                size += slideWidth(slide);
                if (size > getContainerSize() || index === 0) {
                    page++;
                    size = slideWidth(slide);
                    pagination.push({
                        el: slide,
                        snapPoint: getTriggerPosition(slide, index),
                    });
                }
            });
        }
        function generateSlide() {
            let prev = 0;
            Array.from(root.children).forEach((slide, index) => {
                if (size < (root.scrollWidth - rootRect.width) || (size - prev) < (root.scrollWidth - rootRect.width)) {
                    page++;
                    size += slideWidth(slide);
                    prev = slideWidth(slide);
                    pagination.push({
                        el: slide,
                        snapPoint: getTriggerPosition(slide, index),
                    });
                }
                else {
                    if (!pagination.length)
                        return;
                    pagination[pagination.length - 1].snapPoint = (CorgiScroll.slideContainer.scrollWidth - CorgiScroll.slideContainer.getBoundingClientRect().width);
                }
            });
        }
        return pagination;
    }

    function debounce(callback, wait) {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }

    class CorgiScroll {
        root;
        slideContainer; // TODO: Fix this type
        rootBounds = {};
        options = {};
        pagination;
        windowWidth;
        events = {};
        active;
        on;
        emit;
        constructor(root, options) {
            this.root = root;
            // @ts-ignore  // TODO: Fix this type
            this.slideContainer = this.root.children[0];
            this.rootBounds = this.slideContainer.getBoundingClientRect();
            this.windowWidth = window.innerWidth;
            this.active = 0;
            const defaults = {
                root: this.root,
                rootBounds: this.rootBounds,
                style: 'dot',
                type: 'page',
                snapType: getComputedStyle(this.root.children[0].children[0]).getPropertyValue('scroll-snap-align'),
                arrowLeftHtml: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g><line x1="13.5" y1="7" x2="0.5" y2="7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></line><polyline points="4 3.5 0.5 7 4 10.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></polyline></g></svg>',
                arrowRightHtml: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g><line x1="0.5" y1="7" x2="13.5" y2="7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></line><polyline points="10 10.5 13.5 7 10 3.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></polyline></g></svg>',
            };
            this.options = Object.assign(defaults, options);
            this.pagination = {
                el: null,
                slides: FindSteps(this, this.options, this.slideContainer)
            };
            const event = Events(this);
            this.on = event.on;
            this.emit = event.emit;
            if (options.arrows)
                Arrows(this, this.options).init();
            this.init();
        }
        init() {
            this.initialiseSlideClasses();
            window.addEventListener('resize', this.emit('resized'));
            window.addEventListener('resize', this.handleResize);
            this.slideContainer.addEventListener('scroll', () => {
                this.emit('scroll');
            });
            PaginationDot(this, this.options, this.pagination);
        }
        go(index) {
            const getLeftPosition = (index) => {
                return this.pagination.slides[index].snapPoint;
            };
            console.log(getLeftPosition(index));
            this.slideContainer.scrollTo({
                top: 0,
                left: getLeftPosition(index),
                behavior: 'smooth'
            });
            this.updateActive(index);
        }
        next() {
            if ((this.active + 1) >= this.pagination.slides.length)
                return;
            this.go(this.active + 1);
        }
        prev() {
            if ((this.active - 1) < 0)
                return;
            this.go(this.active - 1);
        }
        updateActive(index) {
            this.active = index;
        }
        handleResize = debounce(() => {
            if (this.windowWidth < window.innerWidth || this.windowWidth > window.innerWidth) {
                this.windowWidth = window.innerWidth;
                // const calculatedSteps = FindSteps(this, this.options, this.slideContainer);
                // if (calculatedSteps.length > this.pagination.slides.length || calculatedSteps.length < this.pagination.slides.length) {
                //     this.pagination.slides = FindSteps(this, this.options, this.slideContainer);
                // }
                this.pagination.slides = FindSteps(this, this.options, this.slideContainer);
                this.emit('refresh');
                this.emit('resize');
            }
        }, 200);
        initialiseSlideClasses() {
            Array.from(this.slideContainer.children).forEach((slide, index) => {
                let info = slide.getBoundingClientRect();
                slide.setAttribute('data-slide', index.toString());
                slide.setAttribute('data-position', info.x.toString());
            });
        }
    }

    return CorgiScroll;

}));
