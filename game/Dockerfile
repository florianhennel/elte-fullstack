FROM node:18
WORKDIR /app/game
ADD . /app/game
RUN npm install
EXPOSE 8989
CMD ["npm", "run", "dev", "--", "--host"]