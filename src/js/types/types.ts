export interface Options {
    
    root: HTMLElement;
    rootBounds: any;
    pagination: HTMLElement;

    snapType: string;


    /**
     * Determines how the pagination will be build. If 'page' is choses then corgiscroll will generate
     * the pagination based off the possible number of 'pages'. If 'slide' is chosen then there will
     * be one for each slider. 
     */
    type: string;

    /**
     * Choose a style of the slider pagination
     * - 'dot'
     * A normal dot style pgination. One dot per slide or per page, depending on the chosen settings
     * 
     * - 'number'
     * Page number type of pagination. eg 1/3, 2/3
     * 
     * - 'percent'
     * The bar fills up as you scroll further along the track.
     * 
     * - 'scrollbar'
     * A scrollbar that acts like the native scrollbar.
     */
    style: string;
}

export interface Pagination {
    el: HTMLElement | null;

    slides: any;
}