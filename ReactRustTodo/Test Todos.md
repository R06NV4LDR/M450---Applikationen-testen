# Test Todos

## Backend

| **ID** | **Beschreibung**                       | **Erwartetes Resultat**                                                                                                    |
| ------ | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1      | Diesel Migration                       | Befehl `diesel migration run`erstellt erfolgreich die Datenbank.                                                           |
| 2      | API startet                            | API startet ohne fehlermeldung                                                                                             |
| 3      | API erreichbar                         | Die API ist über den `/health` Endpunkt erreichbar und gibt eine `200` Rückgabe mit dem Satz `Everything is working fine`. |
| 4      | API unbekannte Endpunkte               | Unbekannte Endpunkte geben eine `404` Rückgabe mit dem Satz `Resource not found`.                                          |
| 5      | DB Verbindung                          | Die Datenbank Ressource lässt sich erfolgreich erstellen und verbindet zu der in der `dotenv`definierten Variable.         |
| 6      | `Todo` Objekt Erstellung               | Es lassen sich `Todo` wie auch `NewTodo` Objekte mit den korrekten werten erstellen.                                       |
| 7      | Einfügen von `Todo` Objekten in die DB | `Todo` Objekte können durch`create_todo()`in die Datenbank eingefügt werden.                                               |
| 8      | Abfragen der `Todo` nach `id`          | `Todo` Objekte lassen sich von der Datenbank abfragen und geben das erwartende Object zurück.                              |
| 9      |                                        |                                                                                                                            |
