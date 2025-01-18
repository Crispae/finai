export interface LLMProvider {

    id: string;
    name: string;
    logo: string;

}

export interface LLMModel {

    id: string;
    name: string;
    providerId: string;
    description: string;
    maxTokens: number;
    isDefault?: boolean;
}