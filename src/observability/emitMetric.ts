import MetricEmitter from "./MetricEmitter";

export default function emitMetric(name: string, value: number, tags: string[]): void {
    const m: MetricEmitter = new MetricEmitter(name);
    m.send(value,tags);
}