if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

echo $MONGO_DB_NAME
echo $MONGO_USER
echo $MONGO_PASS

until mongo --eval "print(\"waited for connection\")"
do
    sleep 1
done

echo "Adding user to MongoDB..."
mongo $MONGO_DB_NAME --eval "db.createUser({ mechanisms: [\"SCRAM-SHA-1\"], user: \"$MONGO_USER\", pwd: \"$MONGO_PASS\", roles: [ { role: \"readWrite\", db: \"$MONGO_DB_NAME\" } ] });"
echo "User added."
