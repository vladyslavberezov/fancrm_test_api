#FROM node:20
#
#WORKDIR /app
#
#COPY package*.json ./
#
#RUN npm install
#
#COPY . .
#
##RUN npm run build
#
#EXPOSE 3000
#
#CMD ["npm", "run", "start:dev"]


FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=test

EXPOSE 3306

CMD ["mysqld"]
