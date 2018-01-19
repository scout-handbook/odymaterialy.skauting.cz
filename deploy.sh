set -e
git clone https://github.com/swagger-api/swagger-ui.git
URLS=$(echo "    urls: [$(ls API | grep -vE "composer|vendor" | awk -v ORS= '{print "{url: \"https://raw.githubusercontent.com/GenaBitu/OdyMaterialy/master/API/" $1 "/swagger.yaml\", name: \"Version " substr($1, 2) "\"}, "}' | sed 's/..$//')],")
cd swagger-ui
npm install
sed -i -e "/<title>Swagger UI<\/title>/c <title>OdyMateriály API</title>" dist/index.html
sed -i -e "/url: \"http:\/\/petstore\.swagger\.io\/v2\/swagger\.json\",/c \\${URLS}" dist/index.html
grep -Fq "$URLS" dist/index.html
npm run build
