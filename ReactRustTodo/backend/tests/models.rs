use chrono::NaiveDateTime;
use serde_json;
use TodoRustBackend::models::todo::{NewTodo, Todo};

#[test]
fn test_create_todo_struct() {
    let todo = Todo {
        todo_id: 1,
        title: "Test Todo".to_string(),
        description: Some("Test Description".to_string()),
        created_at: None,
        completed: Some(false),
    };

    assert_eq!(todo.todo_id, 1);
    assert_eq!(todo.title, "Test Todo");
    assert_eq!(todo.description, Some("Test Description".to_string()));
    assert_eq!(todo.completed, Some(false));
    assert!(todo.created_at.is_none());
}

#[test]
fn test_todo_clone() {
    let todo = Todo {
        todo_id: 1,
        title: "Original".to_string(),
        description: Some("Original Description".to_string()),
        created_at: None,
        completed: Some(false),
    };

    let cloned = todo.clone();
    assert_eq!(todo.todo_id, cloned.todo_id);
    assert_eq!(todo.title, cloned.title);
    assert_eq!(todo.description, cloned.description);
    assert_eq!(todo.completed, cloned.completed);
}

#[test]
fn test_todo_serialization() {
    let todo = Todo {
        todo_id: 1,
        title: "Serialize Me".to_string(),
        description: Some("Test serialization".to_string()),
        created_at: None,
        completed: Some(true),
    };

    let json = serde_json::to_string(&todo).unwrap();
    assert!(json.contains("\"todo_id\":1"));
    assert!(json.contains("\"title\":\"Serialize Me\""));
    assert!(json.contains("\"description\":\"Test serialization\""));
    assert!(json.contains("\"completed\":true"));
}

#[test]
fn test_todo_deserialization() {
    let json = r#"{
        "todo_id": 42,
        "title": "Deserialized Todo",
        "description": "From JSON",
        "created_at": null,
        "completed": false
    }"#;

    let todo: Todo = serde_json::from_str(json).unwrap();
    assert_eq!(todo.todo_id, 42);
    assert_eq!(todo.title, "Deserialized Todo");
    assert_eq!(todo.description, Some("From JSON".to_string()));
    assert_eq!(todo.completed, Some(false));
}

#[test]
fn test_todo_roundtrip_serialization() {
    let original = Todo {
        todo_id: 123,
        title: "Roundtrip Test".to_string(),
        description: Some("Testing roundtrip".to_string()),
        created_at: None,
        completed: Some(true),
    };

    let json = serde_json::to_string(&original).unwrap();
    let deserialized: Todo = serde_json::from_str(&json).unwrap();

    assert_eq!(original.todo_id, deserialized.todo_id);
    assert_eq!(original.title, deserialized.title);
    assert_eq!(original.description, deserialized.description);
    assert_eq!(original.completed, deserialized.completed);
}

#[test]
fn test_create_new_todo_struct() {
    let new_todo = NewTodo {
        title: "New Todo".to_string(),
        description: Some("New Description".to_string()),
        created_at: None,
        completed: Some(false),
    };

    assert_eq!(new_todo.title, "New Todo");
    assert_eq!(new_todo.description, Some("New Description".to_string()));
    assert_eq!(new_todo.completed, Some(false));
}

#[test]
fn test_create_new_todo_minimal() {
    let new_todo = NewTodo {
        title: "Minimal New Todo".to_string(),
        description: None,
        created_at: None,
        completed: None,
    };

    assert_eq!(new_todo.title, "Minimal New Todo");
    assert_eq!(new_todo.description, None);
    assert_eq!(new_todo.completed, None);
}

#[test]
fn test_new_todo_deserialization() {
    let json = r#"{
        "title": "From JSON",
        "description": "Deserialized",
        "created_at": null,
        "completed": false
    }"#;

    let new_todo: NewTodo = serde_json::from_str(json).unwrap();
    assert_eq!(new_todo.title, "From JSON");
    assert_eq!(new_todo.description, Some("Deserialized".to_string()));
    assert_eq!(new_todo.completed, Some(false));
}

#[test]
fn test_new_todo_deserialization_minimal() {
    let json = r#"{ "title": "Just Title" }"#;

    let new_todo: NewTodo = serde_json::from_str(json).unwrap();
    assert_eq!(new_todo.title, "Just Title");
    assert_eq!(new_todo.description, None);
}

#[test]
fn test_new_todo_with_explicit_null() {
    let json = r#"{
        "title": "Explicit Nulls",
        "description": null,
        "created_at": null,
        "completed": null
    }"#;

    let new_todo: NewTodo = serde_json::from_str(json).unwrap();
    assert_eq!(new_todo.title, "Explicit Nulls");
    assert_eq!(new_todo.description, None);
    assert_eq!(new_todo.created_at, None);
    assert_eq!(new_todo.completed, None);
}

#[test]
fn test_todo_with_long_text() {
    let long_title = "A".repeat(1000);
    let long_description = "B".repeat(5000);

    let todo = Todo {
        todo_id: 1,
        title: long_title.clone(),
        description: Some(long_description.clone()),
        created_at: None,
        completed: Some(false),
    };

    assert_eq!(todo.title.len(), 1000);
    assert_eq!(todo.description.as_ref().unwrap().len(), 5000);

    // Test serialization with long text
    let json = serde_json::to_string(&todo).unwrap();
    let deserialized: Todo = serde_json::from_str(&json).unwrap();
    assert_eq!(deserialized.title.len(), 1000);
    assert_eq!(deserialized.description.as_ref().unwrap().len(), 5000);
}

#[test]
fn test_todo_with_newlines_and_quotes() {
    let todo = Todo {
        todo_id: 1,
        title: "Title with\nnewlines".to_string(),
        description: Some("Description with \"quotes\" and 'apostrophes'".to_string()),
        created_at: None,
        completed: Some(false),
    };

    let json = serde_json::to_string(&todo).unwrap();
    let deserialized: Todo = serde_json::from_str(&json).unwrap();

    assert_eq!(todo.title, deserialized.title);
    assert_eq!(todo.description, deserialized.description);
}

#[test]
fn test_todo_debug_trait() {
    let todo = Todo {
        todo_id: 1,
        title: "Debug Test".to_string(),
        description: Some("Testing Debug".to_string()),
        created_at: None,
        completed: Some(false),
    };

    let debug_str = format!("{:?}", todo);
    assert!(debug_str.contains("Debug Test"));
    assert!(debug_str.contains("Testing Debug"));
}

#[test]
fn test_todo_deserialization_minimal() {
    let json = r#"{
        "todo_id": 1,
        "title": "Minimal Todo",
        "description": null,
        "created_at": null,
        "completed": null
    }"#;

    let todo: Todo = serde_json::from_str(json).unwrap();
    assert_eq!(todo.todo_id, 1);
    assert_eq!(todo.title, "Minimal Todo");
    assert_eq!(todo.description, None);
    assert_eq!(todo.created_at, None);
    assert_eq!(todo.completed, None);
}

#[test]
fn test_empty_title() {
    let json = r#"{
        "todo_id": 1,
        "title": "",
        "description": null,
        "created_at": null,
        "completed": null
    }"#;

    let todo: Todo = serde_json::from_str(json).unwrap();
    assert_eq!(todo.todo_id, 1);
    assert_eq!(todo.title, "");
    assert_eq!(todo.description, None);
    assert_eq!(todo.created_at, None);
    assert_eq!(todo.completed, None);
}

#[test]
fn test_todo_completed_states() {
    let json = r#"{
        "todo_id": 1,
        "title": "Test Todo",
        "description": "Test Description",
        "created_at": null,
        "completed": true
    }"#;

    let todo: Todo = serde_json::from_str(json).unwrap();
    assert_eq!(todo.todo_id, 1);
    assert_eq!(todo.title, "Test Todo");
    assert_eq!(todo.description, Some("Test Description".to_string()));
    assert_eq!(todo.created_at, None);
    assert_eq!(todo.completed, Some(true));
}

#[test]
fn test_create_todo_without_optional_fields() {
    let json = r#"{
        "title": "New Todo",
        "description": null,
        "created_at": null,
        "completed": null
    }"#;

    let new_todo: NewTodo = serde_json::from_str(json).unwrap();
    assert_eq!(new_todo.title, "New Todo");
    assert_eq!(new_todo.description, None);
    assert_eq!(new_todo.created_at, None);
    assert_eq!(new_todo.completed, None);
}

#[test]
fn test_todo_with_special_characters() {
    let json = r#"{
        "todo_id": 1,
        "title": "New Todo",
        "description": "Description with special characters !@#$%^&*()",
        "created_at": null,
        "completed": null
    }"#;

    let todo: Todo = serde_json::from_str(json).unwrap();
    assert_eq!(todo.todo_id, 1);
    assert_eq!(todo.title, "New Todo");
    assert_eq!(todo.description, Some("Description with special characters !@#$%^&*()".to_string()));
    assert_eq!(todo.created_at, None);
    assert_eq!(todo.completed, None);
}
