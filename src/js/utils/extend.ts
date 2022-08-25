/**
 * Extend any object with other properties.
 *
 * @source riot.js
 * @see https://github.com/riot/riot/blob/master/lib/browser/common/util/misc.js
 *
 * @param   {Object} src - Source object.
 * @returns {Object} The resulting extended object.
 *
 * @example
 * let obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
export function extend(src) {
    let obj
    let args = arguments

    for (let i = 1; i < args.length; ++i) {
        if ((obj = args[i])) {
        for (let key in obj) {
            // check if this property of the source object could be overridden
            if (isWritable(src, key)) src[key] = obj[key]
        }
        }
    }

    return src
}