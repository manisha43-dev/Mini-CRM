
import { Card, CardContent, Typography, Box, Grid, LinearProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from '../api/axios';

const StatCard = ({ title, value, color, delta, deltaUp }) => (
  <Card sx={{ borderRadius: 3, border: '0.5px solid', borderColor: 'divider', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ height: 3, background: color, borderRadius: '12px 12px 0 0' }} />
    <CardContent>
      <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary', fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: -1, mt: 1 }}>
        {value ?? '—'}
      </Typography>
      <Typography variant="caption" sx={{ color: deltaUp ? 'success.main' : 'error.main', mt: 0.5, display: 'block' }}>
        {delta}
      </Typography>
    </CardContent>
  </Card>
);

const PipelineBar = ({ label, per, color }) => (
  <Box sx={{mb:2}}>
    <Box sx={{display:'flex',justifyContent:"space-between",mb:1}}>
      <Typography variant="caption" sx={{color:'text.secondary'}}>{label}</Typography>
      <Typography variant="caption" sx={{fontWeight:500}} >{per}%</Typography>
    </Box>
    <LinearProgress variant="determinate" value={per} sx={{ height: 6, borderRadius: 99, backgroundColor: 'action.hover', '& .MuiLinearProgress-bar': { background: color, borderRadius: 99 } }} />
  </Box>
);

const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/dashboard/status").then(res => res.data),
  });

  return (
    <Box >
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, letterSpacing: -0.4 }}>Dashboard</Typography>

      <Grid container spacing={2} sx={{mb:3}} >
        {[
          { title: 'Total Leads', value: data?.totalLeads, color: '#378ADD', delta: '↑ 12%', up: true },
          { title: 'Qualified', value: data?.qualifiedLeads, color: '#1D9E75', delta: '↑ 5', up: true },
          { title: 'Due Today', value: data?.tasksDueToday, color: '#EF9F27', delta: '↓ 2 ', up: false },
          { title: 'Completed', value: data?.completedTasks, color: '#639922', delta: '↑ 8% ', up: true },
        ].map(stat => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.title}>
            <StatCard {...stat} deltaUp={stat.up} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '0.5px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography fontWeight={600} mb={2}>Lead pipeline</Typography>
              <PipelineBar label="New" per={42} color="#378ADD" />
              <PipelineBar label="Contacted" per={28} color="#7F77DD" />
              <PipelineBar label="Qualified" per={18} color="#1D9E75" />
              <PipelineBar label="Closed" per={12} color="#639922" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '0.5px solid', borderColor: 'divider' }}>
            
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;