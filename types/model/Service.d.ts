import { ParserService } from '../interface';
export default class Service {
    private services;
    registerService(serviceName: keyof ParserService, serviceObj: any): void;
    getService<T extends keyof ParserService>(serviceName: T): ParserService[T];
}
