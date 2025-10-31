use std::sync::{Arc, Mutex};

use actix_web::{
    dev::{Response, Service},
    http::{self, StatusCode},
    test, web, App, Error,
};
use serde_json::json;
use TodoRustBackend::{
    api,
    models::todo::Todo,
    repository::{self, mem_repo::MemRepo, RepoBox},
};

fn test_mem_repo() -> RepoBox {
    Arc::new(MemRepo {
        inner: Arc::new(Mutex::new(Vec::new())),
    })
}

// Health endpoint tests
#[actix_web::test]
async fn heatlh_ok() {
    let app = test::init_service(App::new().configure(api::api::config)).await;
    let req = test::TestRequest::get().uri("/api/health").to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());

    let v: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(v.get("message").unwrap(), "Everything is working fine");

    let req_not_found = test::TestRequest::get()
        .uri("/api/not-existing")
        .to_request();

    let resp_not_found = test::call_service(&app, req_not_found).await;
    assert_eq!(resp_not_found.status(), StatusCode::NOT_FOUND);

    let v: serde_json::Value = test::read_body_json(resp_not_found).await;
    assert_eq!(v.get("message").unwrap(), "Resource not found");
}

// Get all todos tests
#[actix_web::test]
async fn get_all_todos_empty() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    let req = test::TestRequest::get().uri("/api/todos").to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());

    let todos: Vec<Todo> = test::read_body_json(resp).await;
    assert_eq!(todos.len(), 0);
}

#[actix_web::test]
async fn get_all_todos_with_data() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    // Create first todo
    let req1 = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "First todo", "description": "First description" }))
        .to_request();
    test::call_service(&app, req1).await;

    // Create second todo
    let req2 = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "Second todo", "description": "Second description" }))
        .to_request();
    test::call_service(&app, req2).await;

    // Get all todos
    let req = test::TestRequest::get().uri("/api/todos").to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());

    let todos: Vec<Todo> = test::read_body_json(resp).await;
    assert_eq!(todos.len(), 2);
    assert_eq!(todos[0].title, "First todo");
    assert_eq!(todos[1].title, "Second todo");
}

// Update todo tests
#[actix_web::test]
async fn update_todo_by_id_success() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    // Create a todo
    let create_req = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "Original title", "description": "Original description" }))
        .to_request();
    let create_resp = test::call_service(&app, create_req).await;
    let created_todo: Todo = test::read_body_json(create_resp).await;

    // Update the todo
    let update_req = test::TestRequest::put()
        .uri(&format!("/api/todos/{}", created_todo.todo_id))
        .set_json(&json!({
            "todo_id": created_todo.todo_id,
            "title": "Updated title",
            "description": "Updated description",
            "created_at": created_todo.created_at,
            "completed": true
        }))
        .to_request();
    let update_resp = test::call_service(&app, update_req).await;
    assert!(update_resp.status().is_success());

    let updated_todo: Todo = test::read_body_json(update_resp).await;
    assert_eq!(updated_todo.todo_id, created_todo.todo_id);
    assert_eq!(updated_todo.title, "Updated title");
    assert_eq!(
        updated_todo.description,
        Some("Updated description".to_string())
    );
    assert_eq!(updated_todo.completed, Some(true));
}

#[actix_web::test]
async fn update_todo_by_id_not_found() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    let req = test::TestRequest::put()
        .uri("/api/todos/999")
        .set_json(&json!({
            "todo_id": 999,
            "title": "Updated title",
            "description": "Updated description"
        }))
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

// Delete todo tests
#[actix_web::test]
async fn delete_todo_by_id_success() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    // Create a todo
    let create_req = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "To be deleted", "description": "Will be removed" }))
        .to_request();
    let create_resp = test::call_service(&app, create_req).await;
    let created_todo: Todo = test::read_body_json(create_resp).await;

    // Delete the todo
    let delete_req = test::TestRequest::delete()
        .uri(&format!("/api/todos/{}", created_todo.todo_id))
        .to_request();
    let delete_resp = test::call_service(&app, delete_req).await;
    assert!(delete_resp.status().is_success());

    // Verify it's deleted by trying to get it
    let get_req = test::TestRequest::get()
        .uri(&format!("/api/todos/{}", created_todo.todo_id))
        .to_request();
    let get_resp = test::call_service(&app, get_req).await;
    assert_eq!(get_resp.status(), StatusCode::NOT_FOUND);
}

// Integration test: full CRUD workflow
#[actix_web::test]
async fn full_crud_workflow() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    // 1. Create a todo
    let create_req = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "Buy groceries", "description": "Milk, eggs, bread" }))
        .to_request();
    let create_resp = test::call_service(&app, create_req).await;
    assert!(create_resp.status().is_success());
    let created_todo: Todo = test::read_body_json(create_resp).await;

    // 2. Read the todo
    let get_req = test::TestRequest::get()
        .uri(&format!("/api/todos/{}", created_todo.todo_id))
        .to_request();
    let get_resp = test::call_service(&app, get_req).await;
    assert!(get_resp.status().is_success());
    let fetched_todo: Todo = test::read_body_json(get_resp).await;
    assert_eq!(fetched_todo.title, "Buy groceries");

    // 3. Update the todo
    let update_req = test::TestRequest::put()
        .uri(&format!("/api/todos/{}", created_todo.todo_id))
        .set_json(&json!({
            "todo_id": created_todo.todo_id,
            "title": "Buy groceries",
            "description": "Milk, eggs, bread, cheese",
            "created_at": created_todo.created_at,
            "completed": true
        }))
        .to_request();
    let update_resp = test::call_service(&app, update_req).await;
    assert!(update_resp.status().is_success());
    let updated_todo: Todo = test::read_body_json(update_resp).await;
    assert_eq!(updated_todo.completed, Some(true));

    // 4. Delete the todo
    let delete_req = test::TestRequest::delete()
        .uri(&format!("/api/todos/{}", created_todo.todo_id))
        .to_request();
    let delete_resp = test::call_service(&app, delete_req).await;
    assert!(delete_resp.status().is_success());

    // 5. Verify deletion
    let verify_req = test::TestRequest::get()
        .uri(&format!("/api/todos/{}", created_todo.todo_id))
        .to_request();
    let verify_resp = test::call_service(&app, verify_req).await;
    assert_eq!(verify_resp.status(), StatusCode::NOT_FOUND);
}

#[actix_web::test]
async fn delete_todo_by_id_not_found() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    let req = test::TestRequest::delete()
        .uri("/api/todos/999")
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

// Get todo by id tests
#[actix_web::test]
async fn get_todo_by_id_success() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    // Create a todo
    let create_req = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "Test todo", "description": "Test description" }))
        .to_request();
    let create_resp = test::call_service(&app, create_req).await;
    let created_todo: Todo = test::read_body_json(create_resp).await;

    // Get the todo by id
    let req = test::TestRequest::get()
        .uri(&format!("/api/todos/{}", created_todo.todo_id))
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());

    let todo: Todo = test::read_body_json(resp).await;
    assert_eq!(todo.todo_id, created_todo.todo_id);
    assert_eq!(todo.title, "Test todo");
    assert_eq!(todo.description, Some("Test description".to_string()));
}

#[actix_web::test]
async fn get_todo_by_id_not_found() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    let req = test::TestRequest::get().uri("/api/todos/999").to_request();
    let resp = test::call_service(&app, req).await;
    assert_eq!(resp.status(), StatusCode::NOT_FOUND);
}

#[actix_web::test]
async fn create_todo_without_description() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    let req = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "Buy groceries" }))
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    let created_todo: Todo = test::read_body_json(resp).await;
    assert_eq!(created_todo.title, "Buy groceries");
}

// Create todo tests
#[actix_web::test]
async fn create_todo_success() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    let req = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "New todo", "description": "New description" }))
        .to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    let created_todo: Todo = test::read_body_json(resp).await;
    assert_eq!(created_todo.title, "New todo");
    assert_eq!(
        created_todo.description,
        Some("New description".to_string())
    );
}
