import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import BlogModel from "@/lib/models/BlogModel";
const fs = require('fs')

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();
export async function GET(req) {
    const blogId =req.nextUrl.searchParams.get("id")
    if (blogId) {
        const blog = await BlogModel.findById(blogId)
        return NextResponse.json(blog)
    }else{
        const blogs = await BlogModel.find({});
        return NextResponse.json({ blogs });
    }
   
}

export async function POST(req) {
  const formData = await req.formData();
  const timestamp = Date.now();
  const image = formData.get("image");

  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const path = `./public/${timestamp}_${image.name}`;

  await writeFile(path,buffer);
  const imgUrl = `/${timestamp}_${image.name}`;

  const blogData = {
    title:`${formData.get('title')}`,
    description:`${formData.get('description')}`,
    category:`${formData.get('category')}`,
    author: `${formData.get('author')}`,
    image:`${imgUrl}`,
    authorImg: `${formData.get('authorImg')}`,

  }

  await BlogModel.create(blogData);
    console.log("Blog saved");
  return NextResponse.json({success:true,msg:"Blog added"})

}

export async function DELETE(req) {
  const id = await req.nextUrl.searchParams.get("id");
  const blog = await BlogModel.findById(id)
  fs.unlink(`./public${blog.image}`,()=>{

  })
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "blog deleted" });
}

