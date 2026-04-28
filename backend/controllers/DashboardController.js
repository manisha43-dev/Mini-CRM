const Lead=require('../models/leadModel');
const Task=require('../models/taskModel');


const getStatus=async(req,res)=>{
    const today=new Date();
    const startOfDay=new Date(today);
    startOfDay.setHours(0,0,0,0)
    const endOfDay=new Date(today);
    endOfDay.setHours(23,59,59,999)

    const [totalLeads,qualifiedLeads,tasksDueToday,completedTasks]=await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({status:'Qualified'}),
        Task.countDocuments({dueDate:{$gte:startOfDay,$lte:endOfDay},status:'Pending'}),
        Task.countDocuments({status:'Done'}),

    ])

    res.json({totalLeads,qualifiedLeads,tasksDueToday,completedTasks})
};

module.exports=getStatus;