use std::fmt::Error;

use crate::models::{
    self,
    todo::{NewTodo, Todo},
};
use async_trait::async_trait;

#[async_trait]
pub trait TodoRepo: Send + Sync + 'static {
    async fn get_todos(&self) -> Vec<Todo>;
    async fn create_todo(&self, new: NewTodo) -> Result<Todo, Error>;
    async fn get_todo_by_id(&self, id: i32) -> Option<Todo>;
    async fn delete_todo_by_id(&self, id: i32) -> Option<usize>;
    async fn update_todo_by_id(&self, id: i32, mut todo: Todo) -> Option<Todo>;
}
