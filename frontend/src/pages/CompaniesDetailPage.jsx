import {  useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import api from "../api/axios";
import { Box, Chip, CircularProgress, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";


const STATUS_COLORS={New:'default',Contacted:'info',Lost:'error',Qualified:'success'}

const CompaniesDetailPage = () => {
    const {id}=useParams();

    const {data,isLoading}=useQuery({
        queryKey:['company',id],
        queryFn:()=>api.get(`/companies/${id}`).then(res=>res.data)
    })

    if(isLoading){
        return <CircularProgress/>
    }
    const{company,leads}=data;


  return (
   <Box>
    <Typography variant="h5" sx={{fontWeight:700}}>{company.name}</Typography>
    <Typography color="text.secondary" sx={{color:""}}>{company.industry} . {company.location}</Typography>
    <Divider sx={{my:3}}/>
    <Typography variant="h6" sx={{fontWeight:600,mb:2}}>Associated Leads</Typography>
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {leads.length===0?(
                <TableRow><TableCell colSpan={4}>No leads associated</TableCell></TableRow>
            ):(
                leads.map(lead=>(
                    <TableRow key={lead._id}>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell><Chip label={lead.status} color={STATUS_COLORS[lead.status]} size="small"/></TableCell>
                        <TableCell>{lead.assignedTo?.name || '-'}</TableCell>
                    </TableRow>
                ))
            )}
        </TableBody>
    </Table>
   </Box>
  )
}

export default CompaniesDetailPage
