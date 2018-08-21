FROM alpine:3.8
RUN apk add --no-cache nodejs python make g++ npm
WORKDIR /app
COPY ./example-app/package.json /app/package.json
COPY ./example-app/package-lock.json /app/package-lock.json
RUN npm install
COPY ./example-app /app
ENTRYPOINT ["node", "index.js"]