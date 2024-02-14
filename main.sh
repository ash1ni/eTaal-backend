export PGPASSWORD=Ufk6L1k9ZsnJG0CInIxfY3gk4LZbIVCv;
cd db;
for file in $(ls); do
	psql -h dpg-cn5n3ktjm4es73doqe7g-a.singapore-postgres.render.com -U etaal_user etaal
	# psql -h localhost -U postgres -d customdb -a -f $file 
done