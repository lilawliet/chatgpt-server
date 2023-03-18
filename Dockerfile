#use the latest LTS (long term support) version 12 of node available from the Docker Hub
FROM node:16
# Create app directory
WORKDIR /dist

RUN yarn 
RUN yarn build

EXPOSE 8088
CMD ["node","index.js"]