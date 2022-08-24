import { Options } from '../types/types';

export function FindSteps(options: Options, root: HTMLElement) {
    let pagination: any= [];
    let size: number        = 0
    let page: number        = 0
    const snapType: string  = options.snapType
    const rootRect = root.getBoundingClientRect();


    /**
     * @param { Element } element - Element to get the width of
     * @returns { number } Total calculated width including all margins, borders & padding
     */
    const slideWidth = (element: Element): number => {            
        const style = getComputedStyle(element);
        return parseInt(style.getPropertyValue('margin-left')) + parseInt(style.getPropertyValue('margin-left')) + element.getBoundingClientRect().width
    }


    /**
     * 
     * @param el Element to grab the trigger position of 
     * @param index Current index of the loop
     * @returns {number } The trigger position of the element in relation to the container
     */
    const getTriggerPosition = (el: Element, index: number): (number | null) => {
        const box = el.getBoundingClientRect()
        
        if (index === 0) return 0
        if (snapType === 'center') return (box.x - rootRect.x) - (rootRect.width / 2)
        else if (snapType === 'start') return box.x - rootRect.x
        
        return null
    }


    /**
     * 
     * @returns {number} Size of the container 
     */
    const getContainerSize = (): number => {
        
        if (snapType === 'center') {
        
            return page === 0 ? (rootRect.width / 2) : rootRect.width
        }
        else if (snapType === 'start') {
            return rootRect.width
        }

        return 0;
    }

    Array.from(root.children).forEach((slide, index) => {
        size += slideWidth(slide);
        if (size > getContainerSize() || index === 0) {
            page++
            size = slideWidth(slide)

            pagination.push({
                el: slide,
                snapPoint: getTriggerPosition(slide, index),
            })
        }
    })

    return pagination
}