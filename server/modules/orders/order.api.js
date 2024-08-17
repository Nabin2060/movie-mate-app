// /*
// create
// list
// read one order
// delete the order
// change the status of order
// */
// day21
// const {mw} = require('../utils/secure')

// const mw=(req,res,next)=>{
//     console.log(req.headers)
//     const {username,password}=req.headers;
//     if(username === "nabin" && password === "password"){
//         next();
//     }
//     res.status(404).json({msg:"user unauthorized"})
// };
// router.get("/",mw(["admin"]),(req,res,next)=>{
//     try{
// res.json({msg:"list all orders",data:req.body})
//     }catch(e){
//         next(e);
//     }
// })



// router.post("/",mw(["user","admin"]), (req, res, next) => {
//     try {
//         res.json({ msg: "created new movie" });
//     } catch (e) {
//         next(e);
//     }
// });


const router = require("express").Router();
const orderController = require("./order.controller");
const { secure } = require("../../utils/secure");

router.get("/", secure(), async (req, res, next) => {
  try {
    console.log("Here");
    const { page, limit, showAll } = req.query;
    const search = {
      id: showAll && req.isAdmin ? "" : req.currentUser,
    };
    const result = await orderController.list({ page, limit, search });
    res.json({ msg: "List all orders", data: result });
  } catch (e) {
    next(e);
  }
});

router.post("/", secure(), async (req, res, next) => {
  try {
    const result = await orderController.create(req.body);
    res.json({
      msg: "Order created Successfully. We will reach out to you soon.",
      data: result,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", secure(), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await orderController.getById(id);
    res.json({ msg: `Get one Order by ${id}`, data: result });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/status", secure(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.approvedBy = req.currentUser;
    const result = await orderController.changeStatus(id, req.body);
    res.json({ msg: `Change status of one Order by ${id}`, data: result });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", secure(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await orderController.updateById(id, req.body);
    res.json({ msg: `updated one Order by ${id}`, data: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;