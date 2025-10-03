use super::todo_repo::TodoRepo;
use crate::models::todo::{NewTodo, Todo};
use async_trait::async_trait;
use std::{
    fmt::Error,
    sync::{Arc, Mutex},
};

#[derive(Clone, Default)]
pub struct MemRepo {
    pub inner: Arc<Mutex<Vec<Todo>>>,
}

#[async_trait]
impl TodoRepo for MemRepo {
    async fn get_todos(&self) -> Vec<Todo> {
        self.inner.lock().unwrap().clone()
    }

    async fn create_todo(&self, todo: NewTodo) -> Result<Todo, Error> {
        let mut v = self.inner.lock().unwrap();
        let id = v.last().map(|t| t.todo_id).unwrap_or(0) + 1;
        let t = Todo {
            todo_id: id,
            title: todo.title,
            description: todo.description,
            created_at: todo.created_at,
            completed: todo.completed,
        };
        v.push(t.clone());
        Ok(t)
    }

    async fn get_todo_by_id(&self, id: i32) -> Option<Todo> {
        self.inner
            .lock()
            .unwrap()
            .iter()
            .find(|t| t.todo_id == id)
            .cloned()
    }

    async fn delete_todo_by_id(&self, id: i32) -> Option<usize> {
        let mut v = self.inner.lock().unwrap();
        if let Some(pos) = v.iter().position(|t| t.todo_id == id) {
            v.remove(pos);
            Some(pos)
        } else {
            None
        }
    }

    async fn update_todo_by_id(&self, id: i32, mut todo: Todo) -> Option<Todo> {
        let mut v = self.inner.lock().unwrap();
        let t = v.iter().find(|t| t.todo_id == id).replace(&todo);
        Some(t.unwrap().to_owned())
    }
}
