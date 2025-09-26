
use actix_web::{http, test};

#[actix_web::test]
async fn heatlh_ok() {
    // init_service für in-memory app
    let app = test::init_service(app_fa)
}

#[cfg(test)]
mod tests {
    #[test]
    fn initial() {
        assert_eq!(1, 2)
    }
}
