use diesel::prelude::*;
use dotenvy::dotenv;
use std::fmt::Error;

// putting self into the use statement is a shorthand for:
// use diesel::r2d2;
use diesel::r2d2::{self, ConnectionManager};

use crate::models::todo::{Todo, NewTodo};
use crate::repository::schema::todos::dsl::*;

type DBPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

pub struct Database {
    pool: DBPool,
}

impl Database {
    pub fn new() -> Self {
        dotenv().ok();
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let manager = ConnectionManager::<MysqlConnection>::new(database_url);
        let pool: DBPool = r2d2::Pool::builder()
            .build(manager)
            .expect("Failed to create pool.");
        Database { pool }
    }

    pub fn get_todos(&self) -> Vec<Todo> {
      todos
          .load::<Todo>(&mut self.pool.get().unwrap())
          .expect("Error loading all todos")
    }

    pub fn create_todo(&self, todo: NewTodo) -> Result<Todo, Error> {
        let todo = NewTodo {
            ..todo
        };
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

    pub fn get_todo_by_id(&self, id: i32) -> Option<Todo> {
        let todo = todos
            .find(id)
            .get_result::<Todo>(&mut self.pool.get().unwrap())
            .expect("Error loading todo by id");
        Some(todo)
    }

    pub fn delete_todo_by_id(&self, id: i32) -> Option<usize> {
        let count = diesel::delete(todos.find(id))
            .execute(&mut self.pool.get().unwrap())
            .expect("Error deleting todo");
        Some(count)
    }

    pub fn update_todo_by_id(&self, id: i32, mut todo: Todo) -> Option<Todo> {
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

