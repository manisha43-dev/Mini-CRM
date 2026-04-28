const Company=require('../models/companyModel');
const Lead=require('../models/leadModel');

//GET-/api/companies

const getCompanies=async(req,res)=>{
    const companies=await Company.find().sort({name:1});
    res.json(companies);
};

//POST- /api/companies

const createCompany=async(req,res)=>{
    const company=await Company.create(req.body);
    res.status(201).json(company);
};

//GET- /api/companies/:id

const getCompany=async(req,res)=>{
    const company=await Company.findById(req.params.id);
    if(!company){
        return res.status(404).json({msg:'Company not found'});
    }
     
    //Associated leads (soft-deleted excluded via model middleware)
    const leads=await Lead.find({company:req.params.id})
    .populate('assignedTo','name');
    res.json({company,leads})
};

module.exports={getCompanies,createCompany,getCompany}