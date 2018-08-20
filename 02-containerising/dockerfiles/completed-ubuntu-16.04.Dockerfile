FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y nodejs npm
WORKDIR /app
COPY ./example-app /app
RUN npm install
ENTRYPOINT ["nodejs", "index.js"]