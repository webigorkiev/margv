export default function margv(argv?: Array<string>|undefined) : Record<string, any> {
    interface argsReduce {
        args: Record<string, any>,
        prev: string|number,
        value: string|number,
        type: 0|1|2,
        prevType: 0|1|2,
        default: boolean,
        used: boolean
    }
    argv = Array.isArray(argv) && argv.length ? argv : process.argv;
    const paramsToString = (v: string) => v.replace(/([^,\[\]():{}]+)/g, `"$1"`);
    const parseValue = (v:string) => {
        if(/^\+\d+/.test(v)) {
            return Number(v);
        }

        if(/^{(.+)}$/.test(v)) {
            return parseValueRecurcive(eval(`(${paramsToString(v)})`));
        }

        if(/^\[(.+)]$/.test(v)) {
            return parseValueRecurcive(eval(`(${paramsToString(v)})`));
        }

        if(v === "undefined") {
            return undefined;
        }

        if(v === "null") {
            return null;
        }

        if(v === "NaN") {
            return NaN;
        }

        if(v === "Infinity") {
            return Infinity;
        }

        if(v === "true") {
            return true;
        }

        if(v === "false") {
            return false;
        }

        if(/^Set\(\[(.+)]\)$/.test(v)) {
            v = v.replace(/^Set/, "");

            return parseValueRecurcive(eval(`(new Set${paramsToString(v)})`));
        }

        if(/^Map\(\[(.+)]\)$/.test(v)) {
            v = v.replace(/^Map/, "");

            return parseValueRecurcive(eval(`(new Map${paramsToString(v)})`));
        }

        return v;
    };
    const parseValueRecurcive = (value: any): any => {

        if(!value) {
            return parseValue(value);
        }

        if(Array.isArray(value) || typeof value === "object") {
            Object.keys(value).map(key => value[key] = parseValueRecurcive(value[key]));

            return value;
        }

        return parseValue(value);
    };
    const changing = (
        deep: string,
        value: any,
        obj: Record<string, any>
    ) => deep.split(".").reduce((
        ac: Record<string, any>,
        v: string,
        i: number,
        array: Array<string>
    ) => {
        if(i === array.length - 1) {
            if(ac[v]) {
                if(Array.isArray(ac[v])) {
                    ac[v].push(value)
                } else {
                    ac[v] = [ac[v], value];
                }
            } else {
                ac[v] = value;
            }
        } else if(!ac.hasOwnProperty(v)) {
            ac[v] = {};
        }

        return ac[v];
    }, obj);
    const setValue = (ac: argsReduce, k: string, v: string) => {
        const value = parseValue(v);

        if(ac.args.hasOwnProperty(k)) {
            if(Array.isArray(ac.args[k])) {
                ac.args[k].push(value);
            } else {
                ac.args[k] = [ac.args[k], value];
            }
        } else {

            if(/\./.test(k)) {
                changing(k, value, ac.args);
            } else {
                ac.args[k] = value;
            }
        }
    };
    const result = {
       '$': argv,
       '$0': argv[1],
       '_': [] as string[]
    };
    let addition = argv.slice(2);
    const stop = addition.indexOf("--");

    if(stop !== -1) {
        result['_'] = addition.slice(stop + 1);
        addition = addition.slice(0, stop);
    }

    addition.push("-$");
    const args = addition.reduce((ac: argsReduce, v: string, i: number, array: Array<string>) : argsReduce => {
        ac.value = v.replace(/^-{1,2}(no-)?/, '');

        if(ac.prevType === 1 && ac.value === v) {
            ac.type = 2;
        } else {
            ac.type = ac.value === v ? 2 : 1;
        }

        if(typeof ac.prev === "string" && ac.prev.indexOf("=") !== -1) {
            const [key, value] = ac.prev.split("=");
            setValue(ac, key as string, value);
            ac.used = false;
        } else {

            if(
                ac.type === ac.prevType
                || (!ac.used && ac.prevType === 2 && i === 1)
                || (!ac.used && ac.prevType === 2 && i === array.length - 1)
            ) {
                ac.args[ac.prev] = ac.default;
                ac.used = false;
            } else if(ac.prevType === 1 && ac.type === 2) {
                setValue(ac, ac.prev as string, v);
                ac.value = parseValue(v);
                ac.used = true;
            } else {
                ac.used = false;
            }
        }

        ac.default = !/^-{1,2}no-/.test(v);
        ac.prev = ac.value;
        ac.prevType = ac.type;
        return ac;
    }, {args: {}, value: "", type: 0, prev: "", prevType: 0, default: true, used: true}).args;

    return Object.assign(result, args);
};
module.exports = margv;