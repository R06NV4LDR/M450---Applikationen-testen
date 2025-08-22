// @generated automatically by Diesel CLI.

diesel::table! {
    todos (todo_id) {
        todo_id -> Integer,
        #[max_length = 255]
        title -> Varchar,
        description -> Nullable<Text>,
        created_at -> Nullable<Datetime>,
        completed -> Nullable<Bool>,
    }
}
