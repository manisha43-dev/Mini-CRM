
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import {
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Card,
  CardContent,
  CardActions,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, CheckCircle } from "@mui/icons-material";

const TasksPage = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    lead: "",
    assignedTo: "",
    dueDate: "",
    status: "Pending",
  });
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then((res) => res.data),
  });

  const { data: leads } = useQuery({
    queryKey: ["leads-all"],
    queryFn: () =>
      api
        .get("/leads", { params: { limit: 100 } })
        .then((res) => res.data.leads),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/auth/users").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setOpen(false);
      setForm({
        title: "",
        lead: "",
        assignedTo: "",
        dueDate: "",
        status: "Pending",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      api.patch(`/tasks/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const updateField = (field) => (e) =>
    setForm((pre) => ({ ...pre, [field]: e.target.value }));

  return (
    <>
      {/* Head */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size={isMobile ? "small" : "medium"}
          onClick={() => setOpen(true)}
        >
          {isMobile ? "Add" : "Add Task"}
        </Button>
      </Box>

      {/* Content */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        /* Mobile: Cards  */
        <Stack spacing={1.5}>
          {tasks?.map((task) => {
            const isAssigned = task.assignedTo?._id === user?._id;
            return (
              <Card key={task._id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography sx={{fontWeight:600,fontSize:14}} >
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.status}
                      color={task.status === "Done" ? "success" : "warning"}
                      size="small"
                    />
                  </Box>
                  <Typography sx={{fontSize:12,mt:1,color:"text.secondary"}}  >
                    Lead: {task.lead?.name || "—"}
                  </Typography>
                  <Typography  sx={{fontSize:12,color:"text.secondary"}} >
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
                {isAssigned && task.status === "Pending" && (
                  <CardActions sx={{ pt: 0, px: 2, pb: 1.5 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircle fontSize="small" />}
                      onClick={() =>
                        statusMutation.mutate({ id: task._id, status: "Done" })
                      }
                    >
                      Mark Done
                    </Button>
                  </CardActions>
                )}
              </Card>
            );
          })}
        </Stack>
      ) : (
        /*  Desktop: Table  */
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table size="small">
            <TableHead sx={{ bgcolor: "grey" }}>
              <TableRow>
                {["Title", "Lead", "Due Date", "Status", "Actions"].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: 600,
                      fontSize: 12,
                      color: "text.secondary",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.map((task) => {
                const isAssigned = task.assignedTo?._id === user?._id;
                return (
                  <TableRow key={task._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{task.title}</TableCell>
                    <TableCell sx={{ color: "text.secondary", fontSize: 13 }}>
                      {task.lead?.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        color={task.status === "Done" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {isAssigned && task.status === "Pending" && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            statusMutation.mutate({
                              id: task._id,
                              status: "Done",
                            })
                          }
                        >
                          Mark Done
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Add Task  */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        disableRestoreFocus
        sx={{maxWidth:"sm"}}
        fullWidth
      >
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={form.title}
              onChange={updateField("title")}
            />
            <FormControl fullWidth>
              <InputLabel>Lead</InputLabel>
              <Select
                value={form.lead}
                label="Lead"
                onChange={updateField("lead")}
              >
                {leads?.map((l) => (
                  <MenuItem key={l._id} value={l._id}>
                    {l.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={form.assignedTo}
                label="Assign To"
                onChange={updateField("assignedTo")}
              >
                {users?.map((u) => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              label="Due Date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.dueDate}
              onChange={updateField("dueDate")}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={updateField("status")}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => createMutation.mutate(form)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TasksPage;
