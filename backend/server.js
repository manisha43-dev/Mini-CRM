const dotenv=require('dotenv');
dotenv.config();

console.log("ENV CHECK:", {
  MONGODB_URI: process.env.MONGODB_URI ? "✅ Found" : "❌ MISSING",
  PORT: process.env.PORT ? "✅ Found" : "❌ MISSING",
  JWT_SECRET: process.env.JWT_SECRET ? "✅ Found" : "❌ MISSING",
});


const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db')
const authRoutes=require('./routes/authRoutes');
const leadsRoutes=require('./routes/leadsRoutes');
const companiesRoutes=require('./routes/companiesRoutes');
const taskRoutes=require('./routes/taskRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');
const path=require('path')


connectDB();

const app=express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://mini-crm-beta-three.vercel.app",
  process.env.CLIENT_URL, 

];

app.use(cors({origin:function(origin,callback){
    if(!origin || allowedOrigins.includes(origin)){
        callback(null,true)
    }
    else{
        callback(new Error("Not allowed by CORS"))
    }
}, credentials:true}));

//Routes
app.use('/api/auth',authRoutes)
app.use('/api/leads',leadsRoutes)
app.use('/api/companies',companiesRoutes)
app.use('/api/tasks',taskRoutes)
app.use('/api/dashboard',dashboardRoutes)

app.get('/',(req,res)=>res.json({status:"API running"}))

//Global error handler
app.use((err,req,res,next)=>{  
    const status=err.statusCode || 500;
    res.status(status).json({msg:err.message || 'Server error'}); 
});



const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})
