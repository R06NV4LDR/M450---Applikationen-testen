use std::sync::{Arc, Mutex};

use actix_web::{
    dev::{Response, Service},
    http::{self, StatusCode},
    test, web, App, Error,
};
use serde_json::json;
use TodoRustBackend::{
    api,
    repository::{self, mem_repo::MemRepo, RepoBox},
};

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

fn test_mem_repo() -> RepoBox {
    Arc::new(MemRepo {
        inner: Arc::new(Mutex::new(Vec::new())),
    })
}

#[actix_web::test]
async fn create_todo_test() {
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(test_mem_repo()))
            .configure(api::api::config),
    )
    .await;

    let req = test::TestRequest::post()
        .uri("/api/todos")
        .set_json(&json!({ "title": "hello", "description": "hello again" }))
        .to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}
