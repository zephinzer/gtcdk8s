FROM alpine:3.2
RUN apk add --no-cache nodejs
WORKDIR /app
COPY ./example-app /app
RUN npm install