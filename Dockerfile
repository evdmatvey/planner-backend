FROM node:20

RUN apt-get update && apt-get install -y tzdata

ENV TZ=Asia/Krasnoyarsk

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 4200

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD [ "npm", "run", "start:prod" ]
