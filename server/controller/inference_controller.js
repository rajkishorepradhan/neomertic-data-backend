const express = require("express");
const router = express.Router();
const inferanceModel = require("../model/inferance_result_collection");
const mongoose = require("mongoose");
const responseFormatter = require("../utils/reponseFormatter");
const { rawListeners } = require("../model/inferance_result_collection");

router.post("/create", express.json(), async (req, res) => {
  try {
    const result = await inferanceModel.create(req.body);
    if (!result) {
      return responseFormatter(400, "could not create new result", result, res);
    }
    return responseFormatter(201, "new result created", result, res);
  } catch (error) {
    console.log(error);
  }
});

// Aggregation pipeline
router.get("/get_dashboard_analysis/:start_date", async (req, res) => {
  try {
    // check wheather date is wrong
    try {
      var date = new Date(req.params.start_date); // get the date value from router
    } catch (error) {
      console.log(error);
    }
    //  Copy the original date
    const original_date = new Date(date);
    // Add one day in Original Date
    const date2 = new Date(date.setDate(date.getDate() + 1));
    // get all the document
    const getAll = await inferanceModel.find();
    // console.log("getall analyiss", getAll)
    // Aggregation for total box profile

    const aggrigate_analysis_totalBox = await inferanceModel.aggregate([
      {
        $match: {
          timestamps: { $gte: original_date, $lt: date },
        },
      },
      {
        $project: {
          class_name: 1,
        },
      },
    ]);

   

    // Aggregation pipiline for total Volume profile total volume
    const aggrigate_analysis_totalVolume = await inferanceModel.aggregate([
      {
        $match: {
          timestamps: { $gte: original_date, $lt: date },
        },
      },
      {
        $project: {
          _id: 1,
          volume: 1,
        },
      },
      {
        $group: {
          _id: {
            $sum: "$_id",
          },
          total_volume: {
            $sum: "$volume",
          },
        },
      },
    ]);
   //  console.log("total Volume", aggrigate_analysis_totalVolume[0].total_volume);
   var totalVolume = {}
    try {
      totalVolume = aggrigate_analysis_totalVolume[0].total_volume
      
    } catch (error) {
      totalVolume = 0;
    }

    // get data as per date wise box count
    let class_box = {
      D0: "",
      D1: "",
      D2: "",
      D3: "",
      D4: "",
      D5: "",
      D6: "",
      D7: "",
      D8: "",
      D9: "",
      D10: "",
      D11: "",
    };
    const D0 = [];
    const D1 = [];
    const D2 = [];
    const D3 = [];
    const D4 = [];
    const D5=[];
    const D6=[];
    const D7=[];
    const D8=[];
    const D9=[];
    const D10=[];
    const D11= [];
    for (let count = 0; count < aggrigate_analysis_totalBox.length; count++) {
      // console.log(aggrigate_analysis_totalBox[count].class_name);
      if (aggrigate_analysis_totalBox[count].class_name === "D0") {
        D0.push(aggrigate_analysis_totalBox[count]);
        class_box.D0 = D0.length;
      } else if (aggrigate_analysis_totalBox[count].class_name === "D1") {
        D1.push(aggrigate_analysis_totalBox[count]);
        class_box.D1 = D1.length;
      } else if (aggrigate_analysis_totalBox[count].class_name === "D2") {
        D2.push(aggrigate_analysis_totalBox[count]);
        class_box.D2 = D2.length;
      } else if (aggrigate_analysis_totalBox[count].class_name === "D3") {
        D3.push(aggrigate_analysis_totalBox[count]);
        class_box.D3 = D3.length;
      } else if (aggrigate_analysis_totalBox[count].class_name === "D4") {
        D4.push(aggrigate_analysis_totalBox[count]);
        class_box.D4 = D4.length;
      } else if (aggrigate_analysis_totalBox[count].class_name === "D4") {
         D5.push(aggrigate_analysis_totalBox[count]);
         class_box.D4 = D4.length;
       } else if (aggrigate_analysis_totalBox[count].class_name === "D4") {
         D6.push(aggrigate_analysis_totalBox[count]);
         class_box.D4 = D4.length;
       } else if (aggrigate_analysis_totalBox[count].class_name === "D4") {
         D7.push(aggrigate_analysis_totalBox[count]);
         class_box.D4 = D4.length;
       } else if (aggrigate_analysis_totalBox[count].class_name === "D4") {
         D8.push(aggrigate_analysis_totalBox[count]);
         class_box.D4 = D4.length;
       } else if (aggrigate_analysis_totalBox[count].class_name === "D4") {
         D9.push(aggrigate_analysis_totalBox[count]);
         class_box.D4 = D4.length;
       } else if (aggrigate_analysis_totalBox[count].class_name === "D4") {
         D10.push(aggrigate_analysis_totalBox[count]);
         class_box.D4 = D4.length;
       } else if (aggrigate_analysis_totalBox[count].class_name === "D4") {
         D11.push(aggrigate_analysis_totalBox[count]);
         class_box.D4 = D4.length;
       }
    }
    // console.log("classBox", class_box);
    let dash_result = "";

    try {
      dash_result = {
        total_volume: totalVolume,
        totol_box: aggrigate_analysis_totalBox.length,
        Box_wise: class_box,
      };
    } catch (error) {
      dash_result = [0, 0, 0];
    }

    return responseFormatter(201, "new result created", dash_result, res);
  } catch (error) {
    console.log(error);
  }
});


router.get("/get_volume_per_hour/:start_date", async (req, res) => {
  try {
    try {
      var date = new Date(req.params.start_date); // get the date value from router
    } catch (error) {
      console.log(error);
    }
    //  Copy the original date
    const original_date = new Date(date);
    const date2 = new Date(date.setDate(date.getDate() + 1));
    //  Aggregation for total volume box wise 
    const aggregate_box_volume = await inferanceModel.aggregate([
      {
        $match: {
          timestamps: { $gte: original_date, $lt: date2 },
        },
      },
      {
        $project: {
        
          class_name:1,
          volume: 1,
        },
        
      },
      {
        $group: {
          _id:'$class_name',
          totalVolume:{$sum:"$volume"},
        }
      }
      // { $group:{ _id:'$department.name', totalEmployees: { $sum:1 } } 
    ])


    // Aggregation for L,B,H Box wise 
    const box_wise_lbh = await inferanceModel.aggregate([
        {
          $match : {
            timestamps: { $gte: original_date, $lt: date2 },
          }
        },
        {
          $project : {
            class_name : 1,
            l : 1,
            b : 1,
            h : 1,
          }
        },
        {
          $group: {
            _id:'$class_name',
            total_l : {$sum : "$l"},
            total_b : {$sum : "$b"},
            total_h : {$sum : "$h"}, 
          }
        }
    ])

    console.log("box_wise_lbh", box_wise_lbh)

    // console.log(aggregate_box_volume)
   //  console.log(original_date);

    //   const date2 = new Date(original_date.setHours(original_date.getHours() + 23));
    //   console.log("date2", date2);
    var final_result = {};
    for (let count = 0; count < 24; count++) {
      let updateTime = new Date(
        original_date.setHours(original_date.getHours() + (count - count))
      );
      let one_hour_add = new Date(
        original_date.setHours(original_date.getHours() + (count - count + 1))
      );

      //Aggrigation pipline
      const aggrigate_analysis_totalVolume = await inferanceModel.aggregate([
        {
          $match: {
            timestamps: { $gte: updateTime, $lt: one_hour_add },
          },
        },
        {
          $project: {
            _id: 1,
            volume: 1,
          },
        },
        {
          $group: {
            _id: {
              $sum: "$_id",
            },
            total_volume: {
              $sum: "$volume",
            },
          },
        },
      ]);

   //   console.log(updateTime)
  
     

      try {
        final_result[updateTime.toISOString()] = 
          aggrigate_analysis_totalVolume[0].total_volume.toFixed(1)
        ;
      } catch (error) {
        final_result[updateTime.toISOString()] = 0;
            
      }
    }

    const final_results = {
      total_volume_time : final_result,
      total_volume_box : aggregate_box_volume,
      box_wise_lbh : box_wise_lbh,
    }

    

    return responseFormatter(201, "new result created", final_results, res);
    // console.log("updatedTIme", updatedTIme)
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
