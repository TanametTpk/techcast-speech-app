import LiveChatAdapter from "./LiveChatAdapter";

export default class MessageIncludeAdapter extends LiveChatAdapter {
    protected isHaveWordInConfig(word: string): boolean {
        let keywords: string[] = Array.from(this.keywordMapping.keys())
        return keywords.some((keyword) => word.includes(keyword));
    }

    protected getNewKeyword(word: string): string {
        let keywords: string[] = Array.from(this.keywordMapping.keys())
        for (let i = 0; i < keywords.length; i++) {
            let keyword: string = keywords[i]
            if (word.includes(keyword)) console.log(this.keywordMapping.get(keyword));
            if (word.includes(keyword)) return this.keywordMapping.get(keyword) || word;
        }
        return word
    }
}