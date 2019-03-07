FROM node:10-alpine
MAINTAINER Max Shapiro "maxshapiro32@ibm.com"
COPY . /data-service
WORKDIR /data-service
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
