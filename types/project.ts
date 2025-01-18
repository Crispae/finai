export interface Project {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    tags?: ProjectTag[];
}


export interface ProjectTag {

    id: number;
    name: string;
    color: string;

}