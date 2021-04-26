export default interface ConfigResponse {
    connectUrl: string,
    statusMessage: ConfigStatusMessage,
}

interface ConfigStatusMessage {
    show: boolean,
    type: 'error' | 'success' | 'warning' | 'info',
    variant: 'subtle' | 'solid' | 'left-accent' | 'top-accent',
    content: string;
}