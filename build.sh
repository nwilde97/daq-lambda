npm install
rm -rf build
scp -r src build
scp -r node_modules build/node_modules
cd build
zip -r ../lambda.zip *
aws lambda update-function-code --profile bm --function-name FileManager --zip-file fileb://../lambda.zip
aws lambda publish-version --profile bm --function-name FileManager
