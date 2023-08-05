FROM node:alpine as node

FROM node as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node as final

RUN mkdir -p /app/dist

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "./dist/app.js"] 