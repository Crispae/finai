export interface PanelConfig {
    id: string;
    component: any;
    defaultSize: number;
    minSize?: number;
    maxSize?: number;
    hidden?: boolean;
}

export interface LayoutConfig {
    topSection : {
        defaultSize: number;
        horizontal: PanelConfig[];
    }

    bottomSection : {
        defaultSize: number;
        hidden?: boolean;
    }

}


export type WorkspaceLayouts = Record<string, LayoutConfig>;