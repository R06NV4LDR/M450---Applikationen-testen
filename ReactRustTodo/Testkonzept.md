# Testkonzept ReactRustTodo

*Nach IEEE 829 Standard*

## Introduction

ReactRustTodo ist eine einfache Todo-Anwendung mit einem **Rust Backend** (Actix-Web Framework) und einem **React Frontend** (TypeScript, Vite). Die Anwendung ermöglicht es Benutzern, Todo-Einträge zu erstellen, anzuzeigen, zu bearbeiten und zu löschen. Das Backend stellt eine REST-API bereit, die mit einer MySQL-Datenbank über Diesel ORM kommuniziert. Das Frontend nutzt Material-UI Komponenten und Zustand-Management für die Benutzeroberfläche.

## Test Items

Die folgenden Komponenten und Module werden getestet:

### Backend (Rust/Actix-Web)
- **API-Endpunkte** (`/api/todos/*`, `/health`)
- **Datenmodelle** (`Todo`, `NewTodo`)
- **Datenbankschicht** (Diesel ORM, MySQL-Verbindung)
- **HTTP-Server** (Actix-Web, CORS-Konfiguration)
- **Repository-Pattern** (Database-Abstraktion)

### Frontend (React/TypeScript)
- **React-Komponenten** (App, Todos, CreateTodoModal, EditModal)
- **HTTP-Client** (Axios für API-Kommunikation)
- **State Management** (Zustand Store)
- **UI-Bibliotheken** (Material-UI Integration)

### Integration
- **Frontend-Backend Kommunikation** (HTTP REST API)
- **Datenbank-Integration** (Diesel Migrations)
- **CORS-Konfiguration** (Cross-Origin Requests)

## Features to be tested

### Backend Features
1. **Health Check** - `/health` Endpunkt Verfügbarkeit
2. **CRUD Operationen für Todos**:
   - `POST /api/todos` - Todo erstellen
   - `GET /api/todos` - Alle Todos abrufen
   - `GET /api/todos/{id}` - Einzelnes Todo abrufen
   - `PUT /api/todos/{id}` - Todo aktualisieren
   - `DELETE /api/todos/{id}` - Todo löschen
3. **Datenbankoperationen** - CRUD mit MySQL über Diesel
4. **Fehlerbehandlung** - 404 für unbekannte Endpunkte
5. **CORS-Unterstützung** - Cross-Origin Requests von Frontend

### Frontend Features
1. **Komponentenrendering** - Korrekte Anzeige aller UI-Komponenten
2. **API-Integration** - HTTP-Requests an Backend-Endpunkte
3. **State Management** - Todo-Zustand über Zustand Store
4. **Formularvalidierung** - Eingabevalidierung für Todo-Erstellung/-Bearbeitung
5. **Benutzerinteraktionen** - CRUD-Operationen über UI

### End-to-End Features
1. **Vollständiger Todo-Workflow** - Erstellen, Anzeigen, Bearbeiten, Löschen
2. **Error Handling** - Frontend-Reaktion auf Backend-Fehler
3. **Datenbank-Persistierung** - Daten bleiben nach Server-Neustart erhalten

## Features not to be tested

- **Performance/Load Testing** - Nicht im Scope dieses Projekts
- **Security Testing** - Keine Authentifizierung/Autorisierung implementiert
- **Browser-Kompatibilität** - Entwicklung nur für moderne Browser
- **Mobile Responsiveness** - Desktop-fokussierte Anwendung
- **Deployment-Prozesse** - Nur lokale Entwicklungsumgebung

## Approach

### Testmethoden

1. **Unit Tests (Backend)**
   - Rust-native `#[cfg(test)]` Module für Modelle und Repository-Funktionen
   - Mockable Database-Layer für isolierte Tests

2. **Integration Tests (Backend)**
   - HTTP-Endpunkt Tests mit Testdatenbank
   - Diesel Migration Tests

3. **Unit Tests (Frontend)**
   - React Testing Library für Komponententests
   - Jest für JavaScript/TypeScript Unit Tests

4. **End-to-End Tests**
   - Manuelle Tests der kompletten User Journeys
   - API-Tests mit Tools wie Postman/curl

### Test-Driven Development (TDD)
Neue Features werden nach TDD-Prinzipien entwickelt:
1. Test schreiben (Red)
2. Minimale Implementierung (Green)
3. Refactoring (Refactor)

## Item pass / fail criteria

### Erfolgskriterien
- **Backend API**: HTTP 200/201 für erfolgreiche Operationen
- **Frontend**: Komponenten rendern ohne React-Fehler
- **Datenbank**: CRUD-Operationen erfolgreich ausgeführt
- **Integration**: Frontend kann Backend erreichen und Daten austauschen

### Fehlklassifikation

#### Geringfügige Fehler (Minor)
- UI-Styling-Probleme ohne Funktionsverlust
- Kleine Validierungsfehler
- Nicht-kritische Console-Warnings

#### Mittelschwere Fehler (Major)
- API-Endpunkte geben falsche HTTP-Statuscodes zurück
- Formulardaten werden nicht korrekt verarbeitet
- State Management funktioniert inkonsistent

#### Schwerwiegende Fehler (Critical)
- Server startet nicht (Port-Konflikte, DB-Verbindung)
- Frontend rendert nicht (Build-Fehler, JS-Exceptions)
- Datenbank-Migrations schlagen fehl
- Kompletter Funktionsverlust einer Feature

## Test Deliverables

### Artefakte
- **Testkonzept** (dieses Dokument)
- **Test Cases** (siehe "Test Todos.md")
- **Test Reports** - Ergebnisdokumentation pro Testlauf
- **Bug Reports** - Strukturierte Fehlerdokumentation

### Werkzeuge
- **Backend Testing**: Rust `cargo test`, Postman/curl für API-Tests
- **Frontend Testing**: Jest, React Testing Library, ESLint
- **Database Testing**: Diesel CLI für Migrations
- **Manual Testing**: Browser DevTools, Postman

## Testing Tasks

### Teststufen

1. **Unit Testing**
   - Backend: Rust Modelle und Repository-Funktionen testen
   - Frontend: React Komponenten isoliert testen

2. **Integration Testing**
   - Backend: API-Endpunkte mit Test-Datenbank
   - Frontend: Komponenten-Integration und API-Calls

3. **System Testing**
   - End-to-End Workflows über komplette Anwendung
   - Cross-Browser Testing (falls erforderlich)

4. **Acceptance Testing**
   - Manuelle Verifikation aller User Stories
   - Performance-Grundlagen (Response-Zeiten)

## Environmental Needs

### Hardware
- **Entwicklungsrechner**: Minimum 8GB RAM, Mehrkern-Prozessor
- **Netzwerk**: Localhost-Verbindung für Frontend-Backend Kommunikation

### Software
- **Backend**:
  - Rust (Edition 2021)
  - MySQL Server
  - Diesel CLI
- **Frontend**:
  - Node.js (LTS Version)
  - NPM/Yarn Package Manager
  - Modern Browser (Chrome/Firefox)

### Test-Datenbank
- **Separate Test-DB**: Isoliert von Entwicklungsdatenbank
- **In-Memory Option**: Für schnelle Unit Tests (SQLite)
- **Migration Reset**: Saubere Datenbank für jeden Testlauf

## Schedule

### Zeitplan

| Phase | Zeitraum | Aktivitäten |
|-------|----------|-------------|
| **Test Setup** | Woche 1 | Test-Infrastruktur einrichten, Test-DB konfigurieren |
| **Unit Tests** | Woche 2 | Backend Modelle/Repository, Frontend Komponenten |
| **Integration Tests** | Woche 3 | API-Endpunkt Tests, Frontend-Backend Integration |
| **System Tests** | Woche 4 | End-to-End Workflows, Bug Fixing |
| **Documentation** | Ende Woche 4 | Test Reports, Final Documentation |

### Meilensteine
- **Backend API vollständig getestet** - Ende Woche 2
- **Frontend Komponenten validiert** - Ende Woche 3
- **Alle kritischen Bugs behoben** - Ende Woche 4
- **Projekt bereit für Abgabe** - Vorabend letzter Tag vor Abgabe

## Verantwortlichkeiten

- **Testkonzept**: Entwicklungsteam
- **Test-Implementierung**: Entwicklungsteam
- **Test-Ausführung**: Entwicklungsteam + Qualitätskontrolle
- **Bug-Fixing**: Entwicklungsteam
- **Test-Dokumentation**: Entwicklungsteam

## Approvals

Dieses Testkonzept wird vom Modulverantwortlichen bei der Schlussabgabe überprüft und bewertet.