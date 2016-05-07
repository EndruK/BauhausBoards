#!/bin/sh

#TODO: check if .db file exists (if no: create it)
#TODO: check if the tables are in the db file (if no: create them)
#TODO: create a sample board-room-user
Check_dir() {
  directory=${PWD##*/}
  if [ "$directory" == "BauhausBoards" ]; then
    return
  else
    echo "Setup Script must be called in the root of BauhausBoards! exiting.."
    exit
  fi
}
Check_db() {
  echo "Checking database file"
  database="data/bauhausboards.db"
  if [ -f "$database" ]; then
    return
  else
    echo "Database not found! Creating.."
    touch $database
  fi
}
Check_tables() {
  database="data/bauhausboards.db"
  table[0]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='content')"
  table[1]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='groups')"
  table[2]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='usergroup')"
  table[3]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='message')"
  table[4]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='room')"
  table[5]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='board')"
  table[6]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='status')"
  table[7]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='user')"
  table[8]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='feedback')"
  table[9]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='msgTo')"
  table[10]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='roomusers')"
  table[11]=sqlite3 $database "SELECT EXISTS (SELECT * FROM sqlite_master WHERE type='table' AND name='background')"
}
Create_tables() {
  echo "create tables"
}
Create_sample() {
  echo "create samples"
}

Check_dir
Check_db
Check_tables
