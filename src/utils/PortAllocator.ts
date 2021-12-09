import getPort from 'get-port';

export default class PortAllocator {
    private static instance: PortAllocator
    private port: number | undefined

    public static getInstance(): PortAllocator {
        if (!this.instance) this.instance = new PortAllocator()
        return this.instance
    }

    public async getPort(): Promise<number> {
        if (!this.port) {
            this.port = await getPort({
                port: getPort.makeRange(3001, 3999),
            })
        }
        return this.port;
    }
}
