export default function Events(CorgiScroll: any) {

    let e = CorgiScroll.events;

    const on = (event: string, listener: Function) => {
        if(typeof e[event] !== 'object') e[event] = [];
        e[event].push(listener);
    }

    // const removeListener = (event, listener) => {
    //     if(typeof e[event] !== 'object') return;
        
    //     const idx: number = e[event].indexOf(listener);
    //     if(idx > -1) e[event].splice(idx, 1);
    // }

    const emit = (event: string, ...args: any) => {
        if(typeof e[event] !== 'object') return;

        e[event].forEach((listener: Function)  => {
            listener.apply(null, args)
        });   
    }
    
    return {
        on,
        emit
    }
}