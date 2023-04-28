
export default class MetricEmitter {
    private metric: string;
    constructor(metric: string) {
        this.metric = metric;
        this.send = this.send.bind(this);
    }
    send(value: number, tags:string[]){
        console.log({metric: this.metric, value: value, tags: tags});
    }
}