import React, { useState } from "react";
import { NewTodo, Todo } from "../types";
import { createTodo, getTodos } from "../middleware/Controller";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";

interface CreateTodoModalProps {
  onCreate: (newTodo: Todo) => void;
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

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  onCreate,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const newTodo: NewTodo = {
      title: (form.elements.namedItem("title") as HTMLInputElement)?.value,
      description: (form.elements.namedItem("description") as HTMLInputElement)
        ?.value,
      completed: (form.elements.namedItem("completed") as HTMLInputElement)
        ?.checked,
    };

    setIsLoading(true);
    try {
      const response = await createTodo(newTodo); // createTodo returns an AxiosResponse
      const createdTodo = response.data; // extract the data from the response
      onCreate(createdTodo as Todo); // make sure the data is of the expected type
    } catch (error) {
      console.error("Failed to create todo: ", error);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  return (
    <div>
      <AddIcon
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
              Create Todo
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
                    fullWidth
                    margin="normal"
                    name="title"
                  />
                  <TextField
                    id="description"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="description"
                  />
                  <Checkbox
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
