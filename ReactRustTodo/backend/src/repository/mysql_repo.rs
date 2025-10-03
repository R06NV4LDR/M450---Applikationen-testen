use async_trait::async_trait;
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, Pool};
use dotenvy::dotenv;
use std::fmt::Error;

// putting self into the use statement is a shorthand for:
// use diesel::r2d2;

use crate::models::todo::{NewTodo, Todo};
use crate::repository::schema::todos::dsl::*;
use crate::repository::todo_repo::TodoRepo;

pub struct MysqlRepo {
    pub pool: Pool<ConnectionManager<MysqlConnection>>,
}

#[async_trait]
impl TodoRepo for MysqlRepo {
    async fn get_todos(&self) -> Vec<Todo> {
        todos
            .load::<Todo>(&mut self.pool.get().unwrap())
            .expect("Error loading all todos")
    }

    async fn create_todo(&self, todo: NewTodo) -> Result<Todo, Error> {
        let todo = NewTodo { ..todo };
        diesel::insert_into(todos)
            .values(&todo)
            .execute(&mut self.pool.get().unwrap())
            .expect("Error creating new todo");
        let updated_todo = todos
            .order(todo_id.desc())
            .first(&mut self.pool.get().unwrap())
            .expect("Error loading todo");

        Ok(updated_todo)
    }

    async fn get_todo_by_id(&self, id: i32) -> Option<Todo> {
        let todo = todos
            .find(id)
            .get_result::<Todo>(&mut self.pool.get().unwrap())
            .expect("Error loading todo by id");
        Some(todo)
    }

    async fn delete_todo_by_id(&self, id: i32) -> Option<usize> {
        let count = diesel::delete(todos.find(id))
            .execute(&mut self.pool.get().unwrap())
            .expect("Error deleting todo");
        Some(count)
    }

    async fn update_todo_by_id(&self, id: i32, mut todo: Todo) -> Option<Todo> {
        todo.todo_id = id;
        let _todo = diesel::update(todos.find(id))
            .set(&todo)
            .execute(&mut self.pool.get().unwrap())
            .expect("Error updating todo");

        let updated_todo = todos
            .find(id)
            .get_result::<Todo>(&mut self.pool.get().unwrap())
            .expect("Error loading todo by id");

        Some(updated_todo)
    }
}
