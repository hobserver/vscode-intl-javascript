import { ParserService } from '../interface';
export default class Service {
    // @ts-ignore
    private services: ParserService & {
        [serviceName: string]: any
    } = {}
    registerService(serviceName: keyof ParserService, serviceObj: any):void {
        this.services[serviceName] = serviceObj;
    }
    getService<T extends keyof ParserService>(serviceName: T): ParserService[T] {
        return this.services[serviceName];
    }
}