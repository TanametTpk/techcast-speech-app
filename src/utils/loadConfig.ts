import fs from 'fs'

export interface CommandConfig {
    commands: KeywordConfig[]
    replaces: KeywordConfig[]
    useReplace: boolean
}

export interface SourceConfig {
    allow: boolean
}

export interface Wav2vecConfig extends SourceConfig {
    processor: "cpu" | "gpu"
}

export interface KeywordConfig {
    words: string[]
    toCommand: string
    ratio?: number
}

export interface WebHookConfig {
    urls: string[]
    allow: boolean
}

export interface Configs {
    wav2vec: Wav2vecConfig
    googlespeech: SourceConfig
    timewraping: SourceConfig
    webhooks: WebHookConfig
}

export const loadConfig = <T>(path: string): T => {
    const raw_configs: string = fs.readFileSync(path).toString()
    const configs: T = JSON.parse(raw_configs)
    return configs
}

export const readConfig = (path: string): Configs => {
    return loadConfig<Configs>(path)
}

export const loadCommandConfig = (path: string): CommandConfig => {
    return loadConfig<CommandConfig>(path)
}