# p2d_postgres
Press To Dress using postgres database

General instructions for using Git

To migrate the database on your local computer follow the following steps:

1) Navigate to the p2d_postgres directory
2) Merge local branch with Khyati to get the "db.sql" file
3) Open up a new terminal
5) Issue command
$ psql -U postgres -c "drop database p2d_postgresdb;"
6) Recreate the database
$  psql -U postgres -c "create database p2d_postgresdb with owner admin2 encoding = 'UNICODE';"
7) Restore the dump
$ psql -U admin2 -d p2d_postgresdb -f db.sql
