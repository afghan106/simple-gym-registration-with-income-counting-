const express=require("express");

const router=express.Router();


router.get("/",(req,res)=>{
    res.render("login",{message:''});
})
router.post('/',(req,res)=>{
    const {username,password}=req.body;
    console.log(username,password);
    if (username==="shakir" ||password==="afghan") {
        res.redirect("/admin/dashboard")
        
    } else {
        res.render("login",{message:"wrong user or password"})
    }
    
    
    
})

module.exports=router;