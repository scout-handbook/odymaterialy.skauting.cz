git clone https://github.com/swagger-api/swagger-ui.git
REPL=$(echo "    urls: [$(ls API | awk -v ORS= '{print "{url: \"https://raw.githubusercontent.com/GenaBitu/OdyMaterialy/master/API/" $1 "/swagger.yaml\", name: \"Version " substr($1, 2) "\"}, "}' | sed 's/..$//')],")
cd swagger-ui
sed -i -e "/url: \"http:\/\/petstore\.swagger\.io\/v2\/swagger\.json\",/c \\${REPL}" dist/index.html
npm run build
