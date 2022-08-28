# CorgiScroll

CorgiScroll is a tiny library that adds clickable pagination to CSS Scroll Snap sliders. Just choose which elements to apply, and you're away! 

![alt text](preview.webp)

## Prerequisites
- Currently only supports the `page` mode. `page` mode works out how many slides are on a 'page' (which is the container the slides are inside) and generates the pagination from that information. 
> Eg. There are 10 slides, with 5 visible in the container at any one time so there will be 2 dots. In `slide` mode there would be 10. 
- Currently only supports `scroll-snap-align: start`
- `scroll-snap-align` needs to be the same for all slides. Mixing values will produce unexpected results
- 

## Roadmap
- Support for `scroll-snap-align: center`
- Support for `scroll-snap-align: end`
- Support for different 'styles' of pagination
    - Percentage bar
    - Scroll bar 
    - Numbered (eg 2/3)
- Adding a drag functionality so we can drag on desktops


## Installation
To get started you can either 
- Use the CDN link and put it before the ending `body` tag
- Import it into your project with npm
- Copy the `corgiscroll.min.js` file straight into your project 

```js
import CorgiScroll from 'netoka/corgiscroll'
```

## Usage
CorgiScroll needs a container element to know what to watch. You need to pass in the direct parent of the slides. Let's pretend we have this markup:

```html
<div id="slider">
    <div> A stylish slide</div>
    <div> A slightly more stylish slide</div>
</div>
```

Now, initialise CorgiScroll
```js
new CorgiScroll( document.querySelector('#slider'))
``` 


### Options 
CorgiScroll doesn't currently have any options available :(