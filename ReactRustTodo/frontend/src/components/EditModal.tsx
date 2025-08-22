import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import { Todo } from "../types";
import { updateTodo } from "../middleware/Controller";
import { TextField } from "@mui/material";

interface EditModalProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const EditModal: React.FC<EditModalProps> = ({ todo, onUpdate }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const updatedTodo: Todo = {
      ...todo,
      title: (form.elements.namedItem("title") as HTMLInputElement)?.value,
      description: (form.elements.namedItem("description") as HTMLInputElement)
        ?.value,
      completed: (form.elements.namedItem("completed") as HTMLInputElement)
        ?.checked,
    };

    setIsLoading(true);
    try {
      await updateTodo(updatedTodo);
      onUpdate(updatedTodo); // Call the callback function here
    } catch (error) {
      console.error("Failed to update todo: ", error);
    } finally {
      setIsLoading(false);
      handleClose();
    }

    // reset the form
    form.reset();
  };

  return (
    <div>
      <EditIcon
        sx={{ fontSize: "20px" }}
        className="cursor-pointer hover:scale-125 transition"
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="">
            <Typography id="modal-modal-title" variant="h6" component="span">
              Edit Todo
            </Typography>
            <Typography
              component={"span"}
              id="modal-modal-description"
              sx={{ mt: 2 }}
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <TextField
                    id="title"
                    label="Title"
                    variant="outlined"
                    defaultValue={todo.title}
                    fullWidth
                    margin="normal"
                    name="title"
                  />
                  <TextField
                    id="description"
                    label="Description"
                    variant="outlined"
                    defaultValue={todo.description}
                    fullWidth
                    margin="normal"
                    name="description"
                  />
                  <Checkbox
                    defaultChecked={todo.completed}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    name="completed"
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                  >
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </form>
              </div>
            </Typography>

            <Button onClick={handleClose}>Close</Button>

          </div>
        </Box>
      </Modal>
    </div>
  );
};
