const Lead = require('../models/leadModel');


//GET- /api/leads
const getLeads = async (req, res,next) => {
    try {
        const { page = 1, limit = 10, search = '', status='' } = req.query;
        const query = {};
     
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;
        const total = await Lead.countDocuments(query);
        const leads = await Lead.find(query)
            .populate('assignedTo', 'name email')
            .populate('company', 'name')
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.json({ leads, total, pages: Math.ceil(total / limit), currentPage: Number(page) });

    } catch (err) {
        console.log('getLeads error:',err);
        res.status(500).json({message:error.message})
        
    }
};


//POST- /api/leads

const createLead = async (req, res) => {
    try{
        const data={...req.body}
         if (!data.assignedTo) delete data.assignedTo;
    if (!data.company) delete data.company;

        const lead = await Lead.create(req.body);
    res.status(201).json(lead);
    }catch(err){
        res.status(400).json({message:err.message})
    }
    
};

//GET= /api/leads/:id

const getlead = async (req, res) => {
    const lead = await Lead.findById(req.params.id)
        .populate('assignedTo', 'name email')
        .populate('company', 'name');
    if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead)
}

//PUT- /api/leads/:id

const updateLead = async (req, res) => {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!lead) {
        return res.status(404).json({ msg: 'Lead not found' });
    }
    res.json(lead);
}

//DELETE- /api/leads/:id -SOFT DELETE

const deleteLead = async (req, res) => {
    const lead = await Lead.findByIdAndDelete(req.params.id, { isDeleted: true }, { returnDocument: 'after' });
    if (!lead) {
        return res.status(404).json({ msg: 'Lead not found' })
    }
    res.json({ msg: 'Lead deleted successfully' })
};

module.exports = { getLeads, createLead, getlead, updateLead, deleteLead };