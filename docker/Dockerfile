FROM node:16-buster

WORKDIR /app
COPY . .

RUN yarn install --frozen-lockfile
CMD ["yarn", "dev"]
