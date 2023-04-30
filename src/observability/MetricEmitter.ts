export default class MetricEmitter {
    private readonly metric: string;
    constructor(metric: string) {
        this.metric = metric;
        this.send = this.send.bind(this);
    }

    send(value: number, tags: string[]) {
        //ToDo: asynchronously emit the metric to our stats server.
        console.log(
            JSON.stringify({
                time: Date.now().valueOf(),
                name: this.metric,
                value: value,
                tags: tags
            })
        );
    }
}