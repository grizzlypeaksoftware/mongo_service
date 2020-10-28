FROM node:14
WORKDIR /app
COPY ..
RUN npm install
SET PORT=3000
EXPOSE 3000
CMD ["node", "app.js"]