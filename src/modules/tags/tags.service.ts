import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { tagSchema, tagUpdateSchema } from './tags.schema';

type TagInput = z.infer<typeof tagSchema>; type TagUpdateInput = z.infer<typeof tagUpdateSchema>;
const slugify=(v:string)=>'tag/'+v.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const mapTag=(item:any, parentName='')=>({ id:item.id, name:item.name, parentId:item.parentId, browseBy: parentName, friendlyUrl:item.friendlyUrl, published:item.published, sidebar:item.sidebar, cmsPageLink:`<%= PageLink(${item.id}) %>` });
export async function listTags(params:{page:number;limit:number;search?:string}){ const where=params.search?{name:{contains:params.search, mode:'insensitive' as const}}:{}; const items=await prisma.tag.findMany({where, include:{parent:true}, orderBy:{name:'asc'}}); return { items: items.map((item)=>mapTag(item,item.parent?.name||'')), pagination:{page:params.page, limit:params.limit, total:items.length, totalPages:1} }; }
export async function getTagById(id:string){ const item=await prisma.tag.findUnique({where:{id}, include:{parent:true}}); return item?mapTag(item,item.parent?.name||''):null; }
export async function createTag(input:TagInput){ const item=await prisma.tag.create({data:{...input, friendlyUrl: input.friendlyUrl || slugify(input.name)}}); return mapTag(item); }
export async function updateTag(id:string, input:TagUpdateInput){ const existing=await prisma.tag.findUnique({where:{id}}); if(!existing) return null; const item=await prisma.tag.update({where:{id}, data:{...input}}); return mapTag(item); }
export async function deleteTag(id:string){ await prisma.tag.delete({where:{id}}); return {success:true}; }
