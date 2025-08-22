use serde::{Deserialize, Serialize};
use diesel::{Queryable, Insertable, AsChangeset};
use chrono::{self, NaiveDateTime};

#[derive(Serialize, Deserialize, Debug, Clone, Queryable, Insertable, AsChangeset)]
#[diesel(table_name = crate::repository::schema::todos)]
pub struct Todo {
    pub todo_id: i32,
    pub title: String,
    pub description: Option<String>,
    pub created_at: Option<NaiveDateTime>,
    pub completed: Option<bool>,
}

#[derive(Deserialize, Insertable)]
#[diesel(table_name = crate::repository::schema::todos)]
pub struct NewTodo {
    pub title: String,
    pub description: Option<String>,
    pub created_at: Option<NaiveDateTime>,
    pub completed: Option<bool>,
}

