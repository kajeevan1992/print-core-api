import type { Request, Response } from 'express';
import { tagListQuerySchema, tagSchema, tagUpdateSchema } from './tags.schema';
import { createTag, deleteTag, getTagById, listTags, updateTag } from './tags.service';
const getId=(v:string|string[]|undefined)=>typeof v==='string'?v:null;
export async function getTags(req:Request,res:Response){res.json({success:true,data:await listTags(tagListQuerySchema.parse(req.query))});}
export async function getTag(req:Request,res:Response){const id=getId(req.params.id); if(!id)return void res.status(400).json({success:false,error:{message:'Invalid tag id'}}); const item=await getTagById(id); if(!item)return void res.status(404).json({success:false,error:{message:'Tag not found'}}); res.json({success:true,data:item});}
export async function postTag(req:Request,res:Response){res.status(201).json({success:true,data:await createTag(tagSchema.parse(req.body))});}
export async function patchTag(req:Request,res:Response){const id=getId(req.params.id); if(!id)return void res.status(400).json({success:false,error:{message:'Invalid tag id'}}); const item=await updateTag(id, tagUpdateSchema.parse(req.body)); if(!item)return void res.status(404).json({success:false,error:{message:'Tag not found'}}); res.json({success:true,data:item});}
export async function removeTag(req:Request,res:Response){const id=getId(req.params.id); if(!id)return void res.status(400).json({success:false,error:{message:'Invalid tag id'}}); res.json({success:true,data:await deleteTag(id)});}
