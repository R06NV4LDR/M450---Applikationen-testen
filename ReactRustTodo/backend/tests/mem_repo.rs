use std::sync::{Arc, Mutex};
use TodoRustBackend::{
    models::todo::{NewTodo, Todo},
    repository::{mem_repo::MemRepo, todo_repo::TodoRepo},
};

fn create_test_repo() -> MemRepo {
    MemRepo {
        inner: Arc::new(Mutex::new(Vec::new())),
    }
}

fn create_new_todo(title: &str, description: Option<&str>) -> NewTodo {
    NewTodo {
        title: title.to_string(),
        description: description.map(|s| s.to_string()),
        created_at: None,
        completed: Some(false),
    }
}

#[actix_web::test]
async fn test_create_todo() {
    let repo = create_test_repo();
    let new_todo = create_new_todo("Test Todo", Some("Test Description"));

    let result = repo.create_todo(new_todo).await;
    assert!(result.is_ok());

    let todo = result.unwrap();
    assert_eq!(todo.todo_id, 1);
    assert_eq!(todo.title, "Test Todo");
    assert_eq!(todo.description, Some("Test Description".to_string()));
    assert_eq!(todo.completed, Some(false));
}

#[actix_web::test]
async fn test_create_multiple_todos() {
    let repo = create_test_repo();

    let todo1 = create_new_todo("First Todo", Some("First Description"));
    let result1 = repo.create_todo(todo1).await;
    assert!(result1.is_ok());
    assert_eq!(result1.unwrap().todo_id, 1);

    let todo2 = create_new_todo("Second Todo", Some("Second Description"));
    let result2 = repo.create_todo(todo2).await;
    assert!(result2.is_ok());
    assert_eq!(result2.unwrap().todo_id, 2);

    let todo3 = create_new_todo("Third Todo", None);
    let result3 = repo.create_todo(todo3).await;
    assert!(result3.is_ok());
    assert_eq!(result3.unwrap().todo_id, 3);
}

#[actix_web::test]
async fn test_get_todos_empty() {
    let repo = create_test_repo();
    let todos = repo.get_todos().await;
    assert_eq!(todos.len(), 0);
}

#[actix_web::test]
async fn test_get_todos_with_data() {
    let repo = create_test_repo();

    // Create multiple todos
    repo.create_todo(create_new_todo("Todo 1", Some("Description 1")))
        .await
        .unwrap();
    repo.create_todo(create_new_todo("Todo 2", Some("Description 2")))
        .await
        .unwrap();
    repo.create_todo(create_new_todo("Todo 3", None))
        .await
        .unwrap();

    let todos = repo.get_todos().await;
    assert_eq!(todos.len(), 3);
    assert_eq!(todos[0].title, "Todo 1");
    assert_eq!(todos[1].title, "Todo 2");
    assert_eq!(todos[2].title, "Todo 3");
}

#[actix_web::test]
async fn test_get_todo_by_id_success() {
    let repo = create_test_repo();

    let created = repo
        .create_todo(create_new_todo("Test Todo", Some("Test Description")))
        .await
        .unwrap();

    let found = repo.get_todo_by_id(created.todo_id).await;
    assert!(found.is_some());

    let todo = found.unwrap();
    assert_eq!(todo.todo_id, created.todo_id);
    assert_eq!(todo.title, "Test Todo");
    assert_eq!(todo.description, Some("Test Description".to_string()));
}

#[actix_web::test]
async fn test_get_todo_by_id_not_found() {
    let repo = create_test_repo();
    let found = repo.get_todo_by_id(999).await;
    assert!(found.is_none());
}

#[actix_web::test]
async fn test_get_todo_by_id_multiple_todos() {
    let repo = create_test_repo();

    // Create multiple todos
    let todo1 = repo
        .create_todo(create_new_todo("First", Some("First Description")))
        .await
        .unwrap();
    let todo2 = repo
        .create_todo(create_new_todo("Second", Some("Second Description")))
        .await
        .unwrap();
    let todo3 = repo
        .create_todo(create_new_todo("Third", Some("Third Description")))
        .await
        .unwrap();

    // Verify we can get each one individually
    let found1 = repo.get_todo_by_id(todo1.todo_id).await;
    assert!(found1.is_some());
    assert_eq!(found1.unwrap().title, "First");

    let found2 = repo.get_todo_by_id(todo2.todo_id).await;
    assert!(found2.is_some());
    assert_eq!(found2.unwrap().title, "Second");

    let found3 = repo.get_todo_by_id(todo3.todo_id).await;
    assert!(found3.is_some());
    assert_eq!(found3.unwrap().title, "Third");
}

#[actix_web::test]
async fn test_update_todo_by_id_success() {
    let repo = create_test_repo();

    let created = repo
        .create_todo(create_new_todo("Original Title", Some("Original Description")))
        .await
        .unwrap();

    let mut updated_todo = created.clone();
    updated_todo.title = "Updated Title".to_string();
    updated_todo.description = Some("Updated Description".to_string());
    updated_todo.completed = Some(true);

    let result = repo.update_todo_by_id(created.todo_id, updated_todo).await;
    assert!(result.is_some());

    let updated = result.unwrap();
    assert_eq!(updated.todo_id, created.todo_id);
    assert_eq!(updated.title, "Updated Title");
    assert_eq!(updated.description, Some("Updated Description".to_string()));
    assert_eq!(updated.completed, Some(true));

    // Verify the change persisted
    let fetched = repo.get_todo_by_id(created.todo_id).await;
    assert!(fetched.is_some());
    assert_eq!(fetched.unwrap().title, "Updated Title");
}

#[actix_web::test]
async fn test_update_todo_by_id_not_found() {
    let repo = create_test_repo();

    let fake_todo = Todo {
        todo_id: 999,
        title: "Fake Todo".to_string(),
        description: Some("Doesn't exist".to_string()),
        created_at: None,
        completed: Some(false),
    };

    let result = repo.update_todo_by_id(999, fake_todo).await;
    assert!(result.is_none());
}

#[actix_web::test]
async fn test_update_todo_partial_fields() {
    let repo = create_test_repo();

    let created = repo
        .create_todo(create_new_todo("Original", Some("Description")))
        .await
        .unwrap();

    // Update only the completed status
    let mut updated_todo = created.clone();
    updated_todo.completed = Some(true);

    let result = repo.update_todo_by_id(created.todo_id, updated_todo).await;
    assert!(result.is_some());

    let updated = result.unwrap();
    assert_eq!(updated.title, "Original");
    assert_eq!(updated.description, Some("Description".to_string()));
    assert_eq!(updated.completed, Some(true));
}

#[actix_web::test]
async fn test_delete_todo_by_id_success() {
    let repo = create_test_repo();

    let created = repo
        .create_todo(create_new_todo("To Delete", Some("Will be removed")))
        .await
        .unwrap();

    let deleted = repo.delete_todo_by_id(created.todo_id).await;
    assert!(deleted.is_some());

    // Verify it's actually deleted
    let not_found = repo.get_todo_by_id(created.todo_id).await;
    assert!(not_found.is_none());
}

#[actix_web::test]
async fn test_delete_todo_by_id_not_found() {
    let repo = create_test_repo();
    let result = repo.delete_todo_by_id(999).await;
    assert!(result.is_none());
}

#[actix_web::test]
async fn test_delete_todo_from_multiple() {
    let repo = create_test_repo();

    // Create multiple todos
    let todo1 = repo
        .create_todo(create_new_todo("First", Some("First Description")))
        .await
        .unwrap();
    let todo2 = repo
        .create_todo(create_new_todo("Second", Some("Second Description")))
        .await
        .unwrap();
    let todo3 = repo
        .create_todo(create_new_todo("Third", Some("Third Description")))
        .await
        .unwrap();

    // Delete the middle one
    let deleted = repo.delete_todo_by_id(todo2.todo_id).await;
    assert!(deleted.is_some());

    // Verify the list now has 2 items
    let todos = repo.get_todos().await;
    assert_eq!(todos.len(), 2);

    // Verify the correct todos remain
    assert_eq!(todos[0].todo_id, todo1.todo_id);
    assert_eq!(todos[1].todo_id, todo3.todo_id);

    // Verify we can't get the deleted todo
    let not_found = repo.get_todo_by_id(todo2.todo_id).await;
    assert!(not_found.is_none());
}

#[actix_web::test]
async fn test_repository_consistency() {
    let repo = create_test_repo();

    // Create
    let created = repo
        .create_todo(create_new_todo("Consistency Test", Some("Testing consistency")))
        .await
        .unwrap();

    // Read
    let fetched = repo.get_todo_by_id(created.todo_id).await.unwrap();
    assert_eq!(created.todo_id, fetched.todo_id);
    assert_eq!(created.title, fetched.title);

    // Update
    let mut updated_todo = fetched.clone();
    updated_todo.completed = Some(true);
    let updated = repo
        .update_todo_by_id(created.todo_id, updated_todo)
        .await
        .unwrap();
    assert_eq!(updated.completed, Some(true));

    // Verify update persisted
    let refetched = repo.get_todo_by_id(created.todo_id).await.unwrap();
    assert_eq!(refetched.completed, Some(true));

    // Delete
    let deleted = repo.delete_todo_by_id(created.todo_id).await;
    assert!(deleted.is_some());

    // Verify deletion
    let not_found = repo.get_todo_by_id(created.todo_id).await;
    assert!(not_found.is_none());

    // Verify empty list
    let todos = repo.get_todos().await;
    assert_eq!(todos.len(), 0);
}

#[actix_web::test]
async fn test_create_todo_without_description() {
    let repo = create_test_repo();
    let new_todo = create_new_todo("No Description Todo", None);

    let result = repo.create_todo(new_todo).await;
    assert!(result.is_ok());

    let todo = result.unwrap();
    assert_eq!(todo.title, "No Description Todo");
    assert_eq!(todo.description, None);
}

#[actix_web::test]
async fn test_todo_id_increments() {
    let repo = create_test_repo();

    let todo1 = repo
        .create_todo(create_new_todo("First", None))
        .await
        .unwrap();
    assert_eq!(todo1.todo_id, 1);

    let todo2 = repo
        .create_todo(create_new_todo("Second", None))
        .await
        .unwrap();
    assert_eq!(todo2.todo_id, 2);

    let todo3 = repo
        .create_todo(create_new_todo("Third", None))
        .await
        .unwrap();
    assert_eq!(todo3.todo_id, 3);
}

#[actix_web::test]
async fn test_todo_id_resets_after_empty() {
    let repo = create_test_repo();

    // Create and delete a todo
    let todo1 = repo
        .create_todo(create_new_todo("First", None))
        .await
        .unwrap();
    assert_eq!(todo1.todo_id, 1);

    repo.delete_todo_by_id(todo1.todo_id).await;

    // After all todos are deleted, ID resets to 1 (in-memory repo behavior)
    let todo2 = repo
        .create_todo(create_new_todo("Second", None))
        .await
        .unwrap();
    assert_eq!(todo2.todo_id, 1);
}
