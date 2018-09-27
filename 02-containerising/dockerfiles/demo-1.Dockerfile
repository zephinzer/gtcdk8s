FROM alpine:3.8
RUN apk add --no-cache nodejs
RUN apk add --no-cache python
RUN apk add --no-cache make
RUN apk add --no-cache g++
RUN apk add --no-cache npm
WORKDIR /app
COPY ./example-app /app
RUN npm install