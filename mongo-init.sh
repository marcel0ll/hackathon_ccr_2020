if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

echo $MONGO_DB_NAME
echo $MONGO_USER
echo $MONGO_PASS
echo $MONGO_URL

MONGO_FULL_URL="mongodb://$MONGO_URL/$MONGO_DB_NAME"

until mongo $MONGO_FULL_URL --eval "print(\"waited for connection\")"
do
    sleep 1
done

echo "Adding user to MongoDB..."
mongo $MONGO_FULL_URL --eval "db.createUser({ mechanisms: [\"SCRAM-SHA-1\"], user: \"$MONGO_USER\", pwd: \"$MONGO_PASS\", roles: [ { role: \"readWrite\", db: \"$MONGO_DB_NAME\" } ] });"
echo "User added."

echo "Creating location index..."
mongo $MONGO_FULL_URL --eval "db.createCollection(\"places\");"
mongo $MONGO_FULL_URL --eval "db.places.createIndex({location: \"2dsphere\"});"
echo "Index created."
