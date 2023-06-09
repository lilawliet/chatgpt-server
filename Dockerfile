#use the latest LTS (long term support) version 12 of node available from the Docker Hub
FROM node:16
# Create app directory
WORKDIR /

COPY . .

RUN yarn 
RUN yarn build

EXPOSE 8088
CMD ["node","dist/index.js"]