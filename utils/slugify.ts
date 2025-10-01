import { text } from "stream/consumers";

export const slugify = (text:string)=>{
    return text.toString().toLowerCase()
    
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}