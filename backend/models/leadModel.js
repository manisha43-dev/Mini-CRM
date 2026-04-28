const mongoose = require('mongoose');


const leadSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    status: { type: String, enum: ['New', 'Contacted', 'Lost', 'Qualified'], default: 'New' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

//Global filter - soft delete leads never appear in normal queries

leadSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
leadSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});

leadSchema.pre('countDocuments', function () { this.where({ isDeleted: false }); });


leadSchema.pre('findOneAndUpdate', function () {
    this.where({ isDeleted: false });
});

module.exports = mongoose.model('Lead', leadSchema);