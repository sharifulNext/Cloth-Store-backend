import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";


// funtion for add product
// const addProduct = async (req,res) => {
//     try {

//         const {name,description,price,category,subCategory,sizes, bestseller} = req.body;
//         const image1 = req.files.image1  && req.files.image1[0]
//         const image2 = req.files.image2  && req.files.image2[0]
//         const image3 = req.files.image3  && req.files.image3[0]
//         const image4 = req.files.image4  && req.files.image4[0]

//         const image = [image1,image2,image3,image4].filter((item)=>item !== undefined)

//         let imgesUrl = await Promise.all(
//             image.map(async(item)=>{
//                 let result = await cloudinary.uploader.upload(item.path,{resource_type:"image"});
//                 return result.secure_url
//             })
//         )


//       const productData = {
//         name,
//         description,
//         category,
//         price:Number(price),
//         subCategory,
//         bestseller: bestseller === "true" ? true : false,
//         sizes:JSON.parse(sizes),
//         image:imgesUrl,
//         date:Date.now()
//       }  
//       console.log(productData);

//       const product = new productModel(productData)
//       await product.save()
      
//         res.json({success:true, message:"Product Added"})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message});
        
//     }

// }
const addProduct = async (req, res) => {
    try {
        //1. all key clear
        const rawBody = req.body;
        const body = {};
        for (let key in rawBody) {
            body[key.replace(/\t/g, '').trim()] = rawBody[key];
        }

        const { name, description, price, category, subCategory, sizes, bestseller } = body;

        // 2. file process
        const image1 = req.files?.image1 ? req.files.image1[0] : null;
        const image2 = req.files?.image2 ? req.files.image2[0] : null;
        const image3 = req.files?.image3 ? req.files.image3[0] : null;
        const image4 = req.files?.image4 ? req.files.image4[0] : null;

        const images = [image1, image2, image3, image4].filter((item) => item !== null);

        // 3. Cloudinary  upload
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        // 4.Data save
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: String(bestseller) === "true",
            sizes: sizes ? JSON.parse(sizes) :[],
            image: imagesUrl,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log("Error Detail:", error);
        res.json({ success: false, message: error.message });
    }
}
// funtion for list product
const listProducts = async (req,res) => {
    try {
         
         const products = await productModel.find({});
         res.json({success:true,products});

    } catch (error) {
        console.log("Error Detail:", error);
        res.json({ success: false, message: error.message });
        
    }

}


// funtion for remove product
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log("Error Detail:", error);
        res.json({ success: false, message: error.message });
        
    }

}


// funtion for single product info
const singleProduct = async (req,res) => {
    try {
        
       const {productId}= req.body
       const product = await productModel.findById(productId);
       res.json({success:true, product})

    } catch (error) {
        console.log("Error Detail:", error);
        res.json({ success: false, message: error.message });
        
    }

}


export {listProducts, addProduct, removeProduct, singleProduct};