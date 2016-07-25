#!/bin/sh

#TODO: create a sample board-room-user
Check_dir() {
  directory=${PWD##*/}
  if [ "$directory" == "BauhausBoards" ]; then
    Check_db
    exit
  else
    echo "Setup Script must be called in the root of BauhausBoards! exiting.."
    exit
  fi
}
Check_db() {
  echo "Checking database file"
  database="./data/bauhausboards.db"
  if [ -f "$database" ]; then
    Create_tables
    return
  else
    echo "Database not found! Creating.."
    touch $database
    Create_tables
  fi
}
Create_tables() {
  echo "create tables"
  scheme="./database.schema"
  database="./data/bauhausboards.db"
  sql=$(cat $scheme)
  if [ -f "$scheme" ]; then
    sqlite3 $database < $scheme
    Create_sample
  else
    echo "Scheme not found! Please reload Schema.."
  fi
}
Create_sample() {
  database="./data/bauhausboards.db"
  now=`date +%Y-%m-%d`
  password=`echo -n password | shasum -a 256 | cut -d " " -f 1`
  pin=`echo -n 0000 | shasum -a 256 | cut -d " " -f 1`
  sql1="INSERT OR IGNORE INTO user (u_name,u_pw,u_date,u_mail,u_descr,u_adminFlag,u_pin) VALUES('admin','$password','$now','admin@example.com','Admin User',1,'$pin')"
  sql2="INSERT OR IGNORE INTO room (r_name,r_descr) VALUES('Exampleroom','A room only as an example')"
  sql3="INSERT OR IGNORE INTO board (b_resX,b_resY,b_room) VALUES(980,574,1)"
  sql4="INSERT OR IGNORE INTO roomusers (ru_room,ru_user) VALUES(1,1)"
  echo "create sample"
  sqlite3 $database "$sql1"
  sqlite3 $database "$sql2"
  sqlite3 $database "$sql3"
  sqlite3 $database "$sql4"
}

Check_dir
echo "done"
