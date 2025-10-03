use crate::{
    models::todo::{NewTodo, Todo},
    repository::RepoBox,
};
use actix_web::{delete, get, post, put, web, HttpResponse, Responder, Result};
use serde::Serialize;

#[post("/todos")]
pub async fn create_todo(db: web::Data<RepoBox>, new_todo: web::Json<NewTodo>) -> HttpResponse {
    match db.create_todo(new_todo.into_inner()).await {
        Ok(todo) => HttpResponse::Ok().json(todo),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/todos/{id}")]
pub async fn get_todo_by_id(db: web::Data<RepoBox>, path: web::Path<(i32,)>) -> HttpResponse {
    match db.get_todo_by_id(path.into_inner().0).await {
        Some(todo) => HttpResponse::Ok().json(todo),
        None => HttpResponse::NotFound().body("Not found"),
    }
}

#[get("/todos")]
pub async fn get_todos(db: web::Data<RepoBox>) -> HttpResponse {
    HttpResponse::Ok().json(db.get_todos().await)
}

#[delete("/todos/{id}")]
pub async fn delete_todo_by_id(db: web::Data<RepoBox>, path: web::Path<(i32,)>) -> HttpResponse {
    match db.delete_todo_by_id(path.into_inner().0).await {
        Some(deleted) => HttpResponse::Ok().json(deleted),
        None => HttpResponse::NotFound().body("Not found"),
    }
}

#[put("/todos/{id}")]
pub async fn update_todo_by_id(
    db: web::Data<RepoBox>,
    path: web::Path<(i32,)>,
    updated_todo: web::Json<Todo>,
) -> HttpResponse {
    match db
        .update_todo_by_id(path.into_inner().0, updated_todo.into_inner())
        .await
    {
        Some(updated) => HttpResponse::Ok().json(updated),
        None => HttpResponse::NotFound().body("Not found"),
    }
}

#[derive(Serialize)]
pub struct Response {
    pub message: String,
}

#[get("/health")]
async fn health() -> impl Responder {
    let response = Response {
        message: "Everything is working fine".to_string(),
    };
    HttpResponse::Ok().json(response)
}

async fn not_found() -> Result<HttpResponse> {
    let response = Response {
        message: "Resource not found".to_string(),
    };
    Ok(HttpResponse::NotFound().json(response))
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(create_todo)
            .service(get_todo_by_id)
            .service(get_todos)
            .service(delete_todo_by_id)
            .service(update_todo_by_id)
            .service(health)
            .default_service(web::route().to(not_found)),
    );
}
