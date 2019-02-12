declare class Logger {
    constructor(space: string);

    log(args: any)
    debug(arg: Object)
    error(title: string, plat: string, err: Error, info: String, print: boolean, report: boolean)
}