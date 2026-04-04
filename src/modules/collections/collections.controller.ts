import type { Request, Response } from 'express';
import { collectionListQuerySchema, collectionSchema, collectionUpdateSchema } from './collections.schema';
import { createCollection, deleteCollection, getCollectionById, listCollections, updateCollection } from './collections.service';
const getId=(v:string|string[]|undefined)=>typeof v==='string'?v:null;
export async function getCollections(req:Request,res:Response){res.json({success:true,data:await listCollections(collectionListQuerySchema.parse(req.query))});}
export async function getCollection(req:Request,res:Response){const id=getId(req.params.id); if(!id)return void res.status(400).json({success:false,error:{message:'Invalid collection id'}}); const item=await getCollectionById(id); if(!item)return void res.status(404).json({success:false,error:{message:'Collection not found'}}); res.json({success:true,data:item});}
export async function postCollection(req:Request,res:Response){res.status(201).json({success:true,data:await createCollection(collectionSchema.parse(req.body))});}
export async function patchCollection(req:Request,res:Response){const id=getId(req.params.id); if(!id)return void res.status(400).json({success:false,error:{message:'Invalid collection id'}}); const item=await updateCollection(id, collectionUpdateSchema.parse(req.body)); if(!item)return void res.status(404).json({success:false,error:{message:'Collection not found'}}); res.json({success:true,data:item});}
export async function removeCollection(req:Request,res:Response){const id=getId(req.params.id); if(!id)return void res.status(400).json({success:false,error:{message:'Invalid collection id'}}); res.json({success:true,data:await deleteCollection(id)});}
