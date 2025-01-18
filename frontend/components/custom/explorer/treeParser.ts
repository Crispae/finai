import { readdir,stat } from 'fs/promises';
import { join } from 'path';


interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileItem[];

}


export async function buildDirectoryTree(dirPath: string): Promise<FileItem[]>{

    const  items: FileItem[] = []

    try {

        const entries = await readdir(dirPath)

        for (const entry of entries){

            const fullPath = join(dirPath, entry)
            const stats = await stat(fullPath)

            if (stats.isDirectory()){

                const children = await buildDirectoryTree(fullPath)
                
                items.push({
                    name: entry,
                    path: fullPath,
                    type: 'directory',
                    children})}
            else {

                items.push({
                    name: entry,
                    path: fullPath,
                    type: 'file'
                })
            }







        }






    }
    catch (error) {
        console.error('Error reading directory:', error)
    }

    return items.sort((a,b) =>{

        if (a.type === "directory" && b.type === "file") return -1
        if (a.type === "file" && b.type === "directory") return 1
        return a.name.localeCompare(b.name)
    })

}