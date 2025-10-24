#!/bin/bash

cargo llvm-cov \
      --ignore-filename-regex '(.cargo/|tests/|examples/|target/|build.rs|main.rs|todo.rs|mysql_repo.rs|schema.rs)' \
      --html
