pub mod mem_repo;
pub mod mysql_repo;
pub mod schema;
pub mod todo_repo;

use std::sync::Arc;
use todo_repo::TodoRepo;
pub type RepoBox = Arc<dyn TodoRepo>;
