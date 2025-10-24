# Backend Test Dokumentation

**Autor: Batuhan Seker**

## Applikationsbeschreibung

Das ist die Backend Applikation für Todo App. Sie wurde in der Programmiersprache **Rust** umgesetzt und verwendet folgende Libraries:

- [Actix Web](https://actix.rs/) - Web Framework
- [Serde](https://serde.rs/) - Serialisation und Deserialisaiton von Datenstrukturen
- [Diesel](https://diesel.rs/) - ORM

## Aufsetzen der Testumgebung

TODO

## Zusamenfassung der Tests

API Tests (12 tests) - tests/api/api_test.rs
- Health endpoint and 404 handling
- Create todos (with/without description)
- Get all todos (empty/with data)
- Get todo by ID (success/not found)
- Update todo by ID (success/not found)
- Delete todo by ID (success/not found)
- Full CRUD workflow integration

Repository Tests (17 tests) - tests/mem_repo.rs
- Create functionality (single/multiple/without description)
- Get all todos (empty/with data)
- Get by ID (success/not found/multiple)
- Update functionality (full/partial/not found)
- Delete functionality (success/not found/from multiple)
- Repository consistency
- ID behavior (increments/resets after empty)

Model Tests (18 tests) - tests/models.rs
- Todo/NewTodo struct creation
- Serialization/deserialization/roundtrip
- Edge cases (long text, special characters, Unicode, newlines, quotes)
- Optional fields handling
- Debug trait


## 
