use actix_web::{web, get, post, delete, put, HttpResponse};
use crate::{models::todo::{Todo, NewTodo}, repository::database::Database};


#[post("/todos")]
pub async fn create_todo(db: web::Data<Database>, new_todo: web::Json<NewTodo>) -> HttpResponse {
  let todo = db.create_todo(new_todo.into_inner());
  match todo {
    Ok(todo) =>HttpResponse::Ok().json(todo),
    Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
  }
}

#[get("/todos/{id}")]
pub async fn get_todo_by_id(db: web::Data<Database>, path: web::Path<(i32,)>) -> HttpResponse {
  let todo = db.get_todo_by_id(path.into_inner().0);
  match todo {
    Some(todo) => HttpResponse::Ok().json(todo),
    None => HttpResponse::NotFound().body("Not found"),
  }
}

#[get("/todos")]
pub async fn get_todos(db: web::Data<Database>) -> HttpResponse {
  let todos = db.get_todos();
  HttpResponse::Ok().json(todos)
}

#[delete("/todos/{id}")]
pub async fn delete_todo_by_id(db: web::Data<Database>, path: web::Path<(i32,)>) -> HttpResponse {
  let deleted = db.delete_todo_by_id(path.into_inner().0);
  match deleted {
    Some(deleted) => HttpResponse::Ok().json(deleted),
    None => HttpResponse::NotFound().body("Not found"),
  }
}

#[put("/todos/{id}")]
pub async fn update_todo_by_id(db: web::Data<Database>, path: web::Path<(i32,)>, updated_todo: web::Json<Todo>) -> HttpResponse {
  let updated = db.update_todo_by_id(path.into_inner().0, updated_todo.into_inner());
  match updated {
    Some(updated) => HttpResponse::Ok().json(updated),
    None => HttpResponse::NotFound().body("Not found"),
  }
}


pub fn config(cfg: &mut web::ServiceConfig) {
  cfg.service(
      web::scope("/api")
          .service(create_todo)
          .service(get_todo_by_id)
          .service(get_todos)
          .service(delete_todo_by_id)
          .service(update_todo_by_id) 
  );
}