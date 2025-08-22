# ReactRustTodo
Simple todo application with a Rust backend and a React frontend.

Clone this repo, then cd into the "backend" directory and create a .env file. Provide your MYSQL database url in this format:

`DATABASE_URL=mysql://<user>:<password>@localhost/<db-name>`

Make sure that the Diesel CLI is installed and run:

`diesel migration run`

Run the backend with:

`cargo run`

Switch to the "frontend" directory and run:
`npm install`

Finally serve the frontend with:
`npm run dev`
