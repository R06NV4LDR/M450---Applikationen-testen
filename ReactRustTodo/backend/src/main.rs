#![allow(non_snake_case)]
use std::{
    iter,
    sync::{Arc, Mutex},
};

use actix_cors::Cors;
use actix_files::Files;
use actix_web::{
    get, http::header, middleware::Logger, web, App, HttpResponse, HttpServer, Responder, Result,
};
use diesel::{
    r2d2::{self, ConnectionManager},
    MysqlConnection,
};
use dotenvy::dotenv;
use serde::Serialize;
use TodoRustBackend::{
    api,
    repository::{mem_repo::MemRepo, mysql_repo::MysqlRepo, RepoBox},
};

fn parse_arg(arg: String) -> String {
    if arg.starts_with("-") {
        return arg.replace("-", "");
    } else {
        return "".to_string();
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let args = std::env::args();
    let mut setup_mem = false;
    args.into_iter().skip(1).for_each(|x| {
        if parse_arg(x) == "m" {
            setup_mem = true;
        }
    });

    let repo: RepoBox;
    if (!setup_mem) {
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let manager = ConnectionManager::<MysqlConnection>::new(database_url);
        let pool = r2d2::Pool::builder()
            .build(manager)
            .expect("Failed to create pool.");
        let mysql_repo = MysqlRepo { pool };
        repo = Arc::new(mysql_repo);
    } else {
        repo = Arc::new(MemRepo {
            inner: Arc::new(Mutex::new(Vec::new())),
        })
    }

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173")
            .allowed_origin("http://localhost:5173/")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ]);
        App::new()
            .app_data(web::Data::new(repo.clone()))
            .configure(api::api::config)
            .service(Files::new("/", "./static").index_file("index.html"))
            .wrap(cors)
            .wrap(Logger::default())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
